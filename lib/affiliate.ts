import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, type PlanId } from "@/lib/stripe";

export type AffiliateStatus = "pending" | "active" | "paused" | "rejected";
export type Milestone = "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  status: AffiliateStatus;
  commission_rate: number;
  stripe_coupon_id: string | null;
  total_clicks: number;
  total_signups: number;
  total_conversions: number;
  total_earned: number;
  total_paid: number;
  milestone: Milestone;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateConversion {
  id: string;
  affiliate_id: string;
  referred_user_id: string | null;
  stripe_subscription_id: string | null;
  stripe_invoice_id: string | null;
  plan_id: string;
  amount: number;
  commission: number;
  status: string;
  type: "initial" | "recurring";
  created_at: string;
}

const MILESTONE_THRESHOLDS: { milestone: Milestone; min: number }[] = [
  { milestone: "diamond", min: 250 },
  { milestone: "platinum", min: 100 },
  { milestone: "gold", min: 50 },
  { milestone: "silver", min: 15 },
  { milestone: "bronze", min: 5 },
];

export async function getAffiliateByCode(code: string): Promise<Affiliate | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("affiliates")
    .select("*")
    .eq("code", code.toLowerCase())
    .single();
  return data as Affiliate | null;
}

export async function getAffiliateByUserId(userId: string): Promise<Affiliate | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data as Affiliate | null;
}

export async function recordClick(
  affiliateId: string,
  ipHash: string | null,
  userAgent: string | null,
  referrer: string | null
) {
  const supabase = createAdminClient();

  // Insert click record
  await supabase.from("affiliate_clicks").insert({
    affiliate_id: affiliateId,
    ip_hash: ipHash,
    user_agent: userAgent,
    referrer: referrer,
  });

  // Get current affiliate to increment
  const affiliate = await getAffiliateById(affiliateId);
  if (affiliate) {
    await supabase
      .from("affiliates")
      .update({
        total_clicks: affiliate.total_clicks + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliateId);
  }
}

export async function recordConversion(
  affiliateId: string,
  referredUserId: string,
  stripeSubscriptionId: string,
  planId: PlanId,
  amount: number
) {
  const supabase = createAdminClient();

  // Idempotency: skip if initial conversion already recorded for this subscription
  const { data: existing } = await supabase
    .from("affiliate_conversions")
    .select("id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .eq("type", "initial")
    .maybeSingle();

  if (existing) return;

  // Get affiliate to use their commission rate
  const affiliate = await getAffiliateById(affiliateId);
  if (!affiliate) return;

  const commission = Number((amount * (affiliate.commission_rate / 100)).toFixed(2));

  // Insert conversion
  await supabase.from("affiliate_conversions").insert({
    affiliate_id: affiliateId,
    referred_user_id: referredUserId,
    stripe_subscription_id: stripeSubscriptionId,
    plan_id: planId,
    amount,
    commission,
    type: "initial",
  });

  // Update affiliate totals
  await supabase
    .from("affiliates")
    .update({
      total_conversions: affiliate.total_conversions + 1,
      total_earned: Number((affiliate.total_earned + commission).toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq("id", affiliateId);

  // Update subscription with affiliate info
  await supabase
    .from("subscriptions")
    .update({
      affiliate_id: affiliateId,
      affiliate_code: affiliate.code,
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  // Check and update milestone
  await updateMilestone(affiliateId);
}

export async function updateMilestone(affiliateId: string) {
  const supabase = createAdminClient();
  const affiliate = await getAffiliateById(affiliateId);
  if (!affiliate) return;

  let newMilestone: Milestone = "none";
  for (const { milestone, min } of MILESTONE_THRESHOLDS) {
    if (affiliate.total_conversions >= min) {
      newMilestone = milestone;
      break;
    }
  }

  if (newMilestone !== affiliate.milestone) {
    // Update milestone and possibly commission rate for platinum
    const updates: Record<string, unknown> = {
      milestone: newMilestone,
      updated_at: new Date().toISOString(),
    };
    if (newMilestone === "platinum" && affiliate.commission_rate < 25) {
      updates.commission_rate = 25;
    }

    await supabase.from("affiliates").update(updates).eq("id", affiliateId);
  }
}

export async function getAffiliateById(id: string): Promise<Affiliate | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("affiliates")
    .select("*")
    .eq("id", id)
    .single();
  return data as Affiliate | null;
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = createAdminClient();

  // Get affiliate base data
  const affiliate = await getAffiliateById(affiliateId);
  if (!affiliate) return null;

  // Get recent conversions
  const { data: recentConversions } = await supabase
    .from("affiliate_conversions")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get clicks last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { count: recentClicks } = await supabase
    .from("affiliate_clicks")
    .select("id", { count: "exact", head: true })
    .eq("affiliate_id", affiliateId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Pending payout (earned - paid)
  const pendingPayout = Number((affiliate.total_earned - affiliate.total_paid).toFixed(2));

  return {
    ...affiliate,
    recentConversions: recentConversions || [],
    recentClicks: recentClicks || 0,
    pendingPayout,
  };
}

export async function getMonthlyEarnings(affiliateId: string) {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("affiliate_conversions")
    .select("commission, created_at, plan_id, status")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Group by month
  const byMonth: Record<string, { month: string; earnings: number; conversions: number }> = {};
  for (const conv of data) {
    if (conv.status === "canceled") continue;
    const date = new Date(conv.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) {
      byMonth[key] = { month: key, earnings: 0, conversions: 0 };
    }
    byMonth[key].earnings = Number((byMonth[key].earnings + conv.commission).toFixed(2));
    byMonth[key].conversions += 1;
  }

  return Object.values(byMonth).sort((a, b) => b.month.localeCompare(a.month));
}

export function getPlanPrice(planId: PlanId): number {
  const priceStr = PLANS[planId]?.priceEur;
  if (!priceStr || priceStr === "0") return 0;
  return parseFloat(priceStr.replace(",", "."));
}

export function getMilestoneProgress(conversions: number): {
  current: Milestone;
  next: Milestone | null;
  nextAt: number;
  progress: number;
} {
  let current: Milestone = "none";
  let currentMin = 0;

  for (const { milestone, min } of MILESTONE_THRESHOLDS) {
    if (conversions >= min) {
      current = milestone;
      currentMin = min;
      break;
    }
  }

  // Find next milestone
  const milestoneOrder: Milestone[] = ["none", "bronze", "silver", "gold", "platinum", "diamond"];
  const currentIdx = milestoneOrder.indexOf(current);
  const next = currentIdx < milestoneOrder.length - 1 ? milestoneOrder[currentIdx + 1] : null;
  const nextAt = next
    ? MILESTONE_THRESHOLDS.find((m) => m.milestone === next)?.min || 0
    : 0;

  const progress = next
    ? Math.min(100, ((conversions - currentMin) / (nextAt - currentMin)) * 100)
    : 100;

  return { current, next, nextAt, progress };
}

export function isCommissionActive(conversionDate: string): boolean {
  const created = new Date(conversionDate);
  const twelveMonthsLater = new Date(created);
  twelveMonthsLater.setMonth(twelveMonthsLater.getMonth() + 12);
  return new Date() < twelveMonthsLater;
}

export async function getOriginalConversion(
  subscriptionId: string
): Promise<AffiliateConversion | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("affiliate_conversions")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .eq("type", "initial")
    .maybeSingle();
  return data as AffiliateConversion | null;
}

export async function recordRecurringCommission(
  affiliateId: string,
  subscriptionId: string,
  planId: string,
  amount: number,
  invoiceId: string,
  originalDate: string
) {
  if (!isCommissionActive(originalDate)) return;

  const supabase = createAdminClient();
  const affiliate = await getAffiliateById(affiliateId);
  if (!affiliate) return;

  const commission = Number((amount * (affiliate.commission_rate / 100)).toFixed(2));

  // Insert with stripe_invoice_id for dedup (unique index will reject duplicates)
  const { error } = await supabase.from("affiliate_conversions").insert({
    affiliate_id: affiliateId,
    stripe_subscription_id: subscriptionId,
    stripe_invoice_id: invoiceId,
    plan_id: planId,
    amount,
    commission,
    type: "recurring",
  });

  // If duplicate invoice, skip silently
  if (error?.code === "23505") return;
  if (error) return;

  // Update affiliate totals
  await supabase
    .from("affiliates")
    .update({
      total_earned: Number((affiliate.total_earned + commission).toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq("id", affiliateId);
}
