import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, type PlanId } from "@/lib/stripe";
import type { ModelTier } from "@/lib/ai/client";

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .single();

  if (!data) return "free";

  if (data.status === "active" || data.status === "trialing") {
    return data.plan_id as PlanId;
  }

  return "free";
}

export async function getUserTier(userId: string): Promise<ModelTier> {
  const planId = await getUserPlan(userId);
  return PLANS[planId].tier;
}

export async function getUsage(userId: string) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();

  const { data } = await supabase
    .from("user_usage")
    .select("words_used, images_used, tts_used, stt_used, ocr_used, inpainting_used")
    .eq("user_id", userId)
    .eq("period", period)
    .single();

  return {
    wordsUsed: data?.words_used || 0,
    imagesUsed: data?.images_used || 0,
    ttsUsed: data?.tts_used || 0,
    sttUsed: data?.stt_used || 0,
    ocrUsed: data?.ocr_used || 0,
    inpaintingUsed: data?.inpainting_used || 0,
  };
}

export async function checkWordLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.wordsUsed < plan.words;
}

export async function checkImageLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.imagesUsed < plan.images;
}

export async function incrementWords(userId: string, count: number) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_words", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export async function incrementImages(userId: string, count: number = 1) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_images", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export async function checkTtsLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.ttsUsed < plan.tts;
}

export async function checkSttLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.sttUsed < plan.stt;
}

export async function checkOcrLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.ocrUsed < plan.ocr;
}

export async function checkInpaintingLimit(userId: string): Promise<boolean> {
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];
  const usage = await getUsage(userId);
  return usage.inpaintingUsed < plan.inpainting;
}

export async function checkDocumentLimit(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const planId = await getUserPlan(userId);
  const plan = PLANS[planId];

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count || 0) < plan.documents;
}

export async function incrementTts(userId: string, count: number = 1) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_tts", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export async function incrementStt(userId: string, count: number = 1) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_stt", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export async function incrementOcr(userId: string, count: number = 1) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_ocr", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export async function incrementInpainting(userId: string, count: number = 1) {
  const supabase = createAdminClient();
  const period = getCurrentPeriod();
  await supabase.rpc("increment_inpainting", {
    p_user_id: userId,
    p_period: period,
    p_count: count,
  });
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
