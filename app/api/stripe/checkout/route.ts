import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { planId } = (await request.json()) as { planId: PlanId };
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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 5,
      metadata: { user_id: user.id },
    },
    metadata: { user_id: user.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/narocnina?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/narocnina?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
