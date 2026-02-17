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

  const { data: payouts } = await admin
    .from("affiliate_payouts")
    .select("*, affiliates(code, user_id)")
    .order("created_at", { ascending: false });

  // Enrich with user emails
  const enriched = [];
  for (const payout of payouts || []) {
    const aff = payout.affiliates as { code: string; user_id: string } | null;
    let email = "";
    if (aff?.user_id) {
      const { data: userData } = await admin.auth.admin.getUserById(aff.user_id);
      email = userData?.user?.email || "";
    }
    enriched.push({
      ...payout,
      affiliate_code: aff?.code || "",
      affiliate_email: email,
    });
  }

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { affiliateId, amount, period, notes } = await request.json();

  if (!affiliateId || !amount || !period) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (Number(amount) < 50) {
    return NextResponse.json(
      { error: "Minimalno izplačilo je €50" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Create payout record
  const { data: payout, error } = await admin
    .from("affiliate_payouts")
    .insert({
      affiliate_id: affiliateId,
      amount: Number(amount),
      period,
      notes: notes || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payout });
}

export async function PATCH(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { payoutId, status } = await request.json();

  if (!payoutId || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  const updates: Record<string, unknown> = { status };
  if (status === "paid") {
    updates.paid_at = new Date().toISOString();

    // Update affiliate total_paid
    const { data: payout } = await admin
      .from("affiliate_payouts")
      .select("affiliate_id, amount")
      .eq("id", payoutId)
      .single();

    if (payout) {
      const { data: affiliate } = await admin
        .from("affiliates")
        .select("total_paid")
        .eq("id", payout.affiliate_id)
        .single();

      if (affiliate) {
        await admin
          .from("affiliates")
          .update({
            total_paid: Number((Number(affiliate.total_paid) + Number(payout.amount)).toFixed(2)),
            updated_at: new Date().toISOString(),
          })
          .eq("id", payout.affiliate_id);
      }
    }
  }

  const { data, error } = await admin
    .from("affiliate_payouts")
    .update(updates)
    .eq("id", payoutId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payout: data });
}
