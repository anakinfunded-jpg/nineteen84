import { createClient } from "@/lib/supabase/server";
import { getAffiliateByUserId, getAffiliateStats, getMilestoneProgress } from "@/lib/affiliate";
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
  if (!affiliate) {
    return NextResponse.json({ error: "Nimate partnerskega računa" }, { status: 404 });
  }

  if (affiliate.status !== "active") {
    return NextResponse.json({
      status: affiliate.status,
      code: affiliate.code,
      milestone: affiliate.milestone,
      milestoneProgress: getMilestoneProgress(affiliate.total_conversions),
    });
  }

  const stats = await getAffiliateStats(affiliate.id);
  if (!stats) {
    return NextResponse.json({ error: "Napaka" }, { status: 500 });
  }

  return NextResponse.json({
    ...stats,
    milestoneProgress: getMilestoneProgress(stats.total_conversions),
  });
}
