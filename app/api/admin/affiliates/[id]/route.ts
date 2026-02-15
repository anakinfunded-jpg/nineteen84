import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateMilestone } from "@/lib/affiliate";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: affiliate } = await admin
    .from("affiliates")
    .select("*")
    .eq("id", id)
    .single();

  if (!affiliate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get conversions
  const { data: conversions } = await admin
    .from("affiliate_conversions")
    .select("*")
    .eq("affiliate_id", id)
    .order("created_at", { ascending: false });

  // Get payouts
  const { data: payouts } = await admin
    .from("affiliate_payouts")
    .select("*")
    .eq("affiliate_id", id)
    .order("created_at", { ascending: false });

  // Get user info
  const { data: userData } = await admin.auth.admin.getUserById(affiliate.user_id);

  return NextResponse.json({
    affiliate: {
      ...affiliate,
      email: userData?.user?.email || "",
      name: userData?.user?.user_metadata?.full_name || "",
    },
    conversions: conversions || [],
    payouts: payouts || [],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient();

  // Allowed fields to update
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status) updates.status = body.status;
  if (body.commission_rate !== undefined) updates.commission_rate = body.commission_rate;
  if (body.note !== undefined) updates.note = body.note;

  const { data, error } = await admin
    .from("affiliates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Recalculate milestone if needed
  await updateMilestone(id);

  return NextResponse.json({ affiliate: data });
}
