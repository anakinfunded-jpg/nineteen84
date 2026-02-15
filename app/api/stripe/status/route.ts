import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/stripe";
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

  const { data: subscription } = await admin
    .from("subscriptions")
    .select(
      "status, plan_id, trial_end, current_period_end, cancel_at_period_end"
    )
    .eq("user_id", user.id)
    .single();

  const planId = await getUserPlan(user.id);
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
          trialEnd: subscription.trial_end,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      : null,
  });
}
