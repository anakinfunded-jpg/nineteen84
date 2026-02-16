import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const MAX_INVITES = 10;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  // Use first 8 chars of user ID as invite code
  const inviteCode = user.id.substring(0, 8);

  // Count successful referrals
  const admin = createAdminClient();
  const { count } = await admin
    .from("user_referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", user.id)
    .eq("status", "converted");

  const used = count || 0;

  return NextResponse.json({
    inviteCode,
    used,
    remaining: Math.max(0, MAX_INVITES - used),
    maxInvites: MAX_INVITES,
    link: `https://www.1984.si/?invite=${inviteCode}`,
  });
}
