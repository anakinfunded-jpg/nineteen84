import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, type PlanId } from "@/lib/stripe";
import { sendNotification } from "@/lib/email/resend";
import { usageWarningEmail } from "@/lib/email/templates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let sent = 0;

  // Get all active/trialing subscriptions (skip free users)
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("user_id, plan_id")
    .eq("status", "active")
    .neq("plan_id", "free");

  if (!subs || subs.length === 0) {
    return Response.json({ message: "Ni aktivnih naročnikov", sent: 0 });
  }

  for (const sub of subs) {
    const plan = PLANS[sub.plan_id as PlanId];
    if (!plan) continue;

    // Get usage for this period
    const { data: usage } = await supabase
      .from("user_usage")
      .select("words_used, images_used")
      .eq("user_id", sub.user_id)
      .eq("period", period)
      .maybeSingle();

    if (!usage) continue;

    const wordsPercent = (usage.words_used / plan.words) * 100;
    const imagesPercent = (usage.images_used / plan.images) * 100;
    const maxPercent = Math.max(wordsPercent, imagesPercent);

    // Determine warning threshold (80% or 100%)
    let warningType: string | null = null;
    let warningPercent = 0;

    if (maxPercent >= 100) {
      warningType = `usage_100_${period}`;
      warningPercent = 100;
    } else if (maxPercent >= 80) {
      warningType = `usage_80_${period}`;
      warningPercent = 80;
    }

    if (!warningType) continue;

    // Check if already sent this warning for this period
    const { data: existing } = await supabase
      .from("notification_log")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("type", warningType)
      .maybeSingle();

    if (existing) continue;

    try {
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
      const email = userData?.user?.email;
      const name = userData?.user?.user_metadata?.full_name || "";

      if (email) {
        await sendNotification({
          to: email,
          subject: warningPercent >= 100
            ? "1984 — Mesečni krediti porabljeni"
            : "1984 — 80% mesečnih kreditov porabljenih",
          html: usageWarningEmail(
            name,
            warningPercent,
            usage.words_used,
            plan.words,
            usage.images_used,
            plan.images
          ),
        });

        await supabase.from("notification_log").insert({
          user_id: sub.user_id,
          type: warningType,
        });

        sent++;
      }
    } catch {
      // Continue with next user
    }
  }

  return Response.json({
    message: `Poslanih ${sent} opozoril o porabi`,
    sent,
  });
}
