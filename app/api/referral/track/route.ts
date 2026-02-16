import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const MAX_INVITES = 10;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { inviteCode } = (await request.json()) as { inviteCode?: string };
  if (!inviteCode || !/^[a-f0-9]{8}$/i.test(inviteCode)) {
    return NextResponse.json({ error: "Neveljavna koda" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Find the referrer using the DB function (looks up auth.users by ID prefix)
  const { data: referrerId } = await admin.rpc("find_user_by_invite_code", {
    code: inviteCode.toLowerCase(),
  });

  if (!referrerId) {
    return NextResponse.json({ error: "Referrer ne obstaja" }, { status: 404 });
  }

  // Don't allow self-referral
  if (referrerId === user.id) {
    return NextResponse.json({ error: "Napaka" }, { status: 400 });
  }

  // Check if referrer hasn't exceeded max invites
  const { count } = await admin
    .from("user_referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", referrerId)
    .eq("status", "converted");

  if ((count || 0) >= MAX_INVITES) {
    return NextResponse.json({ error: "Referrer je dosegel omejitev" }, { status: 400 });
  }

  // Check if this user was already referred
  const { data: existing } = await admin
    .from("user_referrals")
    .select("id")
    .eq("referred_user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, alreadyTracked: true });
  }

  // Record the referral
  await admin.from("user_referrals").insert({
    referrer_id: referrerId,
    referred_email: user.email,
    referred_user_id: user.id,
    status: "pending",
  });

  return NextResponse.json({ ok: true });
}
