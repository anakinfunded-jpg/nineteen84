import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotification } from "@/lib/email/resend";
import { payoutCreatedEmail } from "@/lib/email/templates";
import { verifyCronSecret } from "@/lib/cron-auth";
import { NextRequest } from "next/server";

const MIN_PAYOUT = 50;

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request.headers.get("authorization"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();

  // Get current period label (previous month, e.g. "2026-01")
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const period = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

  // Get all active affiliates
  const { data: affiliates } = await supabase
    .from("affiliates")
    .select("id, user_id, total_earned, total_paid")
    .eq("status", "active");

  if (!affiliates || affiliates.length === 0) {
    return Response.json({ message: "Ni aktivnih partnerjev", created: 0 });
  }

  let created = 0;

  for (const affiliate of affiliates) {
    const balance = Number(
      (Number(affiliate.total_earned) - Number(affiliate.total_paid)).toFixed(2)
    );

    if (balance < MIN_PAYOUT) continue;

    // Check if a payout for this period already exists (prevent duplicates)
    const { data: existing } = await supabase
      .from("affiliate_payouts")
      .select("id")
      .eq("affiliate_id", affiliate.id)
      .eq("period", period)
      .maybeSingle();

    if (existing) continue;

    // Create payout record
    const { error } = await supabase.from("affiliate_payouts").insert({
      affiliate_id: affiliate.id,
      amount: balance,
      period,
      notes: `Avtomatsko izplačilo za ${period}`,
      status: "pending",
    });

    if (error) continue;

    // Send notification email
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(
        affiliate.user_id
      );
      const email = userData?.user?.email;
      const name = userData?.user?.user_metadata?.full_name || "";

      if (email) {
        await sendNotification({
          to: email,
          subject: "1984 — Novo izplačilo ustvarjeno",
          html: payoutCreatedEmail(name, balance, period),
        });
      }
    } catch {
      // Email failure shouldn't block the payout creation
    }

    created++;
  }

  return Response.json({
    message: `Ustvarjenih ${created} izplačil za ${period}`,
    created,
  });
}
