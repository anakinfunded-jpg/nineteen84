import { stripe, getPlanByPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAffiliateByCode, recordConversion, getPlanPrice } from "@/lib/affiliate";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

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

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: planId,
            status: subscription.status,
            current_period_start: period.start,
            current_period_end: period.end,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
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

        // Record affiliate conversion if referred
        const affiliateCode = session.metadata?.affiliate_code;
        if (affiliateCode && userId) {
          const affiliate = await getAffiliateByCode(affiliateCode);
          if (affiliate) {
            const planPrice = getPlanPrice(planId);
            if (planPrice > 0) {
              await recordConversion(
                affiliate.id,
                userId,
                subscriptionId,
                planId,
                planPrice
              );
            }
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

      await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          status: subscription.status,
          current_period_start: period.start,
          current_period_end: period.end,
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

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
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
