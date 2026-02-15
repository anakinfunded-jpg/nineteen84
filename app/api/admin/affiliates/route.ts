import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["anakinfunded@gmail.com"];

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) return null;
  return user;
}

export async function GET() {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();

  const { data: affiliates } = await admin
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  // Get user emails for each affiliate
  const enriched = [];
  for (const aff of affiliates || []) {
    const { data: userData } = await admin.auth.admin.getUserById(aff.user_id);
    enriched.push({
      ...aff,
      email: userData?.user?.email || "",
      name: userData?.user?.user_metadata?.full_name || "",
    });
  }

  // Summary stats
  const total = enriched.length;
  const active = enriched.filter((a) => a.status === "active").length;
  const pending = enriched.filter((a) => a.status === "pending").length;
  const totalEarned = enriched.reduce((s, a) => s + Number(a.total_earned), 0);
  const totalPaid = enriched.reduce((s, a) => s + Number(a.total_paid), 0);
  const totalConversions = enriched.reduce((s, a) => s + a.total_conversions, 0);
  const totalClicks = enriched.reduce((s, a) => s + a.total_clicks, 0);

  return NextResponse.json({
    affiliates: enriched,
    summary: {
      total,
      active,
      pending,
      totalEarned: Number(totalEarned.toFixed(2)),
      totalPaid: Number(totalPaid.toFixed(2)),
      totalOwed: Number((totalEarned - totalPaid).toFixed(2)),
      totalConversions,
      totalClicks,
      conversionRate: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(1)) : 0,
    },
  });
}
