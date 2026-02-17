import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotification } from "@/lib/email/resend";
import { trialExpiringEmail } from "@/lib/email/templates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  let sent = 0;

  // Define warning windows (each ~24h wide so daily cron catches exactly once)
  const warnings = [
    { daysLeft: 3, from: addHours(now, 48), to: addHours(now, 72), type: "trial_3d" },
    { daysLeft: 1, from: addHours(now, 0), to: addHours(now, 24), type: "trial_1d" },
    { daysLeft: 0, from: addHours(now, -24), to: now, type: "trial_expired" },
  ];

  for (const warning of warnings) {
    // Get trialing subscriptions with trial_end in this window
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("user_id, trial_end")
      .eq("status", "trialing")
      .gte("trial_end", warning.from.toISOString())
      .lt("trial_end", warning.to.toISOString());

    if (!subs || subs.length === 0) continue;

    for (const sub of subs) {
      // Check if we already sent this warning (dedup)
      const { data: existing } = await supabase
        .from("notification_log")
        .select("id")
        .eq("user_id", sub.user_id)
        .eq("type", warning.type)
        .maybeSingle();

      if (existing) continue;

      try {
        const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
        const email = userData?.user?.email;
        const name = userData?.user?.user_metadata?.full_name || "";

        if (email) {
          await sendNotification({
            to: email,
            subject: warning.daysLeft <= 0
              ? "1984 — Vaš preizkus se je končal"
              : `1984 — Vaš preizkus se konča čez ${warning.daysLeft === 1 ? "1 dan" : `${warning.daysLeft} dni`}`,
            html: trialExpiringEmail(name, warning.daysLeft),
          });

          // Log to prevent re-sending
          await supabase.from("notification_log").insert({
            user_id: sub.user_id,
            type: warning.type,
          });

          sent++;
        }
      } catch {
        // Continue with next user
      }
    }
  }

  return Response.json({
    message: `Poslanih ${sent} opozoril o preizkusu`,
    sent,
  });
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
