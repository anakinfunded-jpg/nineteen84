import { createClient } from "@/lib/supabase/server";
import { getAffiliateByUserId, getMonthlyEarnings } from "@/lib/affiliate";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const affiliate = await getAffiliateByUserId(user.id);
  if (!affiliate || affiliate.status !== "active") {
    return NextResponse.json({ error: "Nimate aktivnega partnerskega računa" }, { status: 403 });
  }

  const earnings = await getMonthlyEarnings(affiliate.id);
  return NextResponse.json(earnings);
}
