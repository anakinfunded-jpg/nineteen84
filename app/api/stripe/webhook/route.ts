import { stripe, getPlanByPriceId, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAffiliateByCode,
  recordConversion,
  getPlanPrice,
  getOriginalConversion,
  recordRecurringCommission,
} from "@/lib/affiliate";
import { sendNotification } from "@/lib/email/resend";
import {
  welcomeEmail,
  paymentFailedEmail,
  subscriptionCanceledEmail,
  planChangedEmail,
} from "@/lib/email/templates";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

async function getUserEmail(supabase: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await supabase.auth.admin.getUserById(userId);
  return {
    email: data?.user?.email || "",
    name: data?.user?.user_metadata?.full_name || "",
  };
}

async function getUserIdBySubscription(supabase: ReturnType<typeof createAdminClient>, subscriptionId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  return data?.user_id || null;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: item?.current_period_start
      ? new Date(item.current_period_start * 1000).toISOString()
      : null,
    end: item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const planId = getPlanByPriceId(priceId || "");
        const period = getSubscriptionPeriod(subscription);

        // Resolve affiliate_id from session metadata
        const affiliateCode = session.metadata?.affiliate_code;
        let resolvedAffiliateId: string | null = null;
        if (affiliateCode) {
          const affiliate = await getAffiliateByCode(affiliateCode);
          if (affiliate) {
            resolvedAffiliateId = affiliate.id;
          }
        }

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: planId,
            status: subscription.status,
            current_period_start: period.start,
            current_period_end: period.end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            ...(resolvedAffiliateId ? { affiliate_id: resolvedAffiliateId } : {}),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        // Record user invite referral conversion
        const inviteReferrerId = session.metadata?.invite_referrer_id;
        if (inviteReferrerId && userId) {
          // Update existing pending referral to converted
          const { data: existingRef } = await supabase
            .from("user_referrals")
            .select("id")
            .eq("referrer_id", inviteReferrerId)
            .eq("referred_user_id", userId)
            .maybeSingle();

          if (existingRef) {
            await supabase
              .from("user_referrals")
              .update({ status: "converted" })
              .eq("id", existingRef.id);
          } else {
            // Create and immediately mark as converted
            await supabase.from("user_referrals").insert({
              referrer_id: inviteReferrerId,
              referred_user_id: userId,
              status: "converted",
            });
          }
        }

        // Send welcome email
        try {
          const { email, name } = await getUserEmail(supabase, userId);
          if (email) {
            await sendNotification({
              to: email,
              subject: "Dobrodošli v 1984!",
              html: welcomeEmail(name),
            });
          }
        } catch {
          // Email failure shouldn't block webhook
        }

        // Record affiliate conversion if referred
        if (resolvedAffiliateId && userId) {
          const planPrice = getPlanPrice(planId);
          if (planPrice > 0) {
            await recordConversion(
              resolvedAffiliateId,
              userId,
              subscriptionId,
              planId,
              planPrice
            );
          }
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const planId = getPlanByPriceId(priceId || "");
      const period = getSubscriptionPeriod(subscription);

      // Check if plan actually changed (for sending email)
      const { data: prevSub } = await supabase
        .from("subscriptions")
        .select("plan_id, user_id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          status: subscription.status,
          current_period_start: period.start,
          current_period_end: period.end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      // Send plan change email if plan actually changed
      if (prevSub?.user_id && prevSub.plan_id && prevSub.plan_id !== planId && planId !== "free") {
        try {
          const plan = PLANS[planId];
          const { email, name } = await getUserEmail(supabase, prevSub.user_id);
          if (email) {
            await sendNotification({
              to: email,
              subject: `1984 — Paket spremenjen na ${plan.name}`,
              html: planChangedEmail(name, plan.name, plan.priceEur),
            });
          }
        } catch {
          // Email failure shouldn't block webhook
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      // Get user info before updating
      const deletedUserId = await getUserIdBySubscription(supabase, subscription.id);
      const deletedPriceId = subscription.items.data[0]?.price.id;
      const deletedPlanId = getPlanByPriceId(deletedPriceId || "");

      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          plan_id: "free",
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      // Mark affiliate conversion as canceled if applicable
      await supabase
        .from("affiliate_conversions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      // Send cancellation email
      if (deletedUserId) {
        try {
          const planName = PLANS[deletedPlanId]?.name || deletedPlanId;
          const { email, name } = await getUserEmail(supabase, deletedUserId);
          if (email) {
            await sendNotification({
              to: email,
              subject: "1984 — Naročnina preklicana",
              html: subscriptionCanceledEmail(name, planName),
            });
          }
        } catch {
          // Email failure shouldn't block webhook
        }
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId =
        subDetails && "subscription" in subDetails
          ? typeof subDetails.subscription === "string"
            ? subDetails.subscription
            : subDetails.subscription?.id
          : null;

      // Skip initial subscription creation (already handled at checkout)
      if (
        !subscriptionId ||
        invoice.billing_reason === "subscription_create"
      ) {
        break;
      }

      // Look up subscription for affiliate_id
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("affiliate_id, plan_id")
        .eq("stripe_subscription_id", subscriptionId)
        .maybeSingle();

      if (sub?.affiliate_id) {
        const original = await getOriginalConversion(subscriptionId);
        if (original) {
          const planPrice = getPlanPrice(sub.plan_id);
          if (planPrice > 0) {
            await recordRecurringCommission(
              sub.affiliate_id,
              subscriptionId,
              sub.plan_id,
              planPrice,
              invoice.id,
              original.created_at
            );
          }
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId =
        subDetails && "subscription" in subDetails
          ? typeof subDetails.subscription === "string"
            ? subDetails.subscription
            : subDetails.subscription?.id
          : null;

      if (subscriptionId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);

        // Send payment failure email
        try {
          const failedUserId = await getUserIdBySubscription(supabase, subscriptionId);
          if (failedUserId) {
            const { data: subData } = await supabase
              .from("subscriptions")
              .select("plan_id")
              .eq("stripe_subscription_id", subscriptionId)
              .maybeSingle();

            const planName = PLANS[subData?.plan_id as keyof typeof PLANS]?.name || "vaš paket";
            const { email, name } = await getUserEmail(supabase, failedUserId);
            if (email) {
              await sendNotification({
                to: email,
                subject: "1984 — Plačilo ni uspelo",
                html: paymentFailedEmail(name, planName),
              });
            }
          }
        } catch {
          // Email failure shouldn't block webhook
        }
      }
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;

      try {
        // Suspend all subscriptions for this customer
        const customerId = typeof dispute.charge === "string"
          ? undefined
          : (dispute.charge as Stripe.Charge)?.customer;
        const custId = typeof customerId === "string" ? customerId : undefined;

        if (custId) {
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", custId);
        }

        // Notify admin
        await sendNotification({
          to: "anakinfunded@gmail.com",
          subject: `1984 — Spor za plačilo (${dispute.amount / 100} EUR)`,
          html: `<p>Prejet spor za plačilo v višini <strong>${dispute.amount / 100} EUR</strong>.</p><p>Stripe Dispute ID: ${dispute.id}</p><p>Razlog: ${dispute.reason}</p>`,
        });
      } catch {
        console.error("[webhook] dispute processing error");
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
