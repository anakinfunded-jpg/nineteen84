import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";
import { getAffiliateByCode } from "@/lib/affiliate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { planId, ref } = (await request.json()) as { planId: PlanId; ref?: string };
  const plan = PLANS[planId];

  if (!plan || !plan.priceId) {
    return NextResponse.json({ error: "Neveljaven paket" }, { status: 400 });
  }

  // Check if user already has a Stripe customer
  const admin = createAdminClient();
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
  }

  // Check for affiliate referral
  let affiliateId: string | undefined;
  let affiliateCode: string | undefined;
  const discounts: { coupon: string }[] = [];

  if (ref) {
    const affiliate = await getAffiliateByCode(ref);
    if (affiliate && affiliate.status === "active" && process.env.STRIPE_AFFILIATE_COUPON_ID) {
      affiliateId = affiliate.id;
      affiliateCode = affiliate.code;
      discounts.push({ coupon: process.env.STRIPE_AFFILIATE_COUPON_ID });
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    ...(discounts.length > 0 ? { discounts } : {}),
    subscription_data: {
      trial_period_days: 5,
      metadata: { user_id: user.id },
    },
    metadata: {
      user_id: user.id,
      ...(affiliateId ? { affiliate_id: affiliateId, affiliate_code: affiliateCode } : {}),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/narocnina?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/narocnina?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
