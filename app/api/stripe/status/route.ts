import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, syncStripeSubscription } from "@/lib/stripe";
import { getUserPlan, getUsage } from "@/lib/credits";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const admin = createAdminClient();

  let planId = await getUserPlan(user.id);

  // Self-healing: if DB shows free, check Stripe directly
  if (planId === "free" && user.email) {
    const synced = await syncStripeSubscription(user.id, user.email, admin);
    if (synced) {
      planId = synced;
    }
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select(
      "status, plan_id, current_period_end, cancel_at_period_end"
    )
    .eq("user_id", user.id)
    .single();

  const plan = PLANS[planId];
  const usage = await getUsage(user.id);

  return NextResponse.json({
    planId,
    plan: {
      name: plan.name,
      priceEur: plan.priceEur,
      words: plan.words,
      images: plan.images,
      tier: plan.tier,
    },
    usage,
    subscription: subscription
      ? {
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      : null,
  });
}
