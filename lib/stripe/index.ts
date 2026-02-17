import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export type PlanId = "free" | "osnovno" | "profesionalno" | "poslovno";

export interface PlanConfig {
  name: string;
  priceId: string | null;
  priceEur: string;
  words: number;
  images: number;
  tts: number;
  stt: number;
  ocr: number;
  inpainting: number;
  documents: number;
  tier: "free" | "premium";
  features: string[];
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    name: "Brezplačno",
    priceId: null,
    priceEur: "0",
    words: 2_000,
    images: 10,
    tts: 5,
    stt: 5,
    ocr: 10,
    inpainting: 3,
    documents: 5,
    tier: "free",
    features: [
      "2.000 besed",
      "10 slik",
      "AI Chat",
      "3 predloge",
    ],
  },
  osnovno: {
    name: "Osnovno",
    priceId: process.env.STRIPE_PRICE_OSNOVNO || null,
    priceEur: "16,90",
    words: 20_000,
    images: 200,
    tts: 50,
    stt: 50,
    ocr: 100,
    inpainting: 20,
    documents: 25,
    tier: "premium",
    features: [
      "20.000 besed",
      "200 slik",
      "AI Chat",
      "15 predlog",
      "E-poštna podpora",
    ],
  },
  profesionalno: {
    name: "Profesionalno",
    priceId: process.env.STRIPE_PRICE_PROFESIONALNO || null,
    priceEur: "39,90",
    words: 50_000,
    images: 400,
    tts: 150,
    stt: 100,
    ocr: 400,
    inpainting: 80,
    documents: 100,
    tier: "premium",
    features: [
      "50.000 besed",
      "400 slik",
      "Vse predloge",
      "Najzmogljivejši AI (Opus)",
      "Prednostna podpora",
    ],
  },
  poslovno: {
    name: "Poslovno",
    priceId: process.env.STRIPE_PRICE_POSLOVNO || null,
    priceEur: "84,90",
    words: 150_000,
    images: 800,
    tts: 400,
    stt: 300,
    ocr: 800,
    inpainting: 250,
    documents: 250,
    tier: "premium",
    features: [
      "150.000 besed",
      "800 slik",
      "API dostop",
      "Najzmogljivejši AI (Opus)",
      "Telefonska podpora",
    ],
  },
};

export function getPlanByPriceId(priceId: string): PlanId {
  for (const [id, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return id as PlanId;
  }
  return "free";
}

/**
 * Self-healing sync: if the DB shows "free" but Stripe has an active subscription,
 * sync it to the database. Handles webhook failures gracefully.
 */
export async function syncStripeSubscription(
  userId: string,
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: { from: (...args: any[]) => any }
): Promise<PlanId | null> {
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return null;

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) return null;

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;
    const planId = getPlanByPriceId(priceId || "");

    if (planId === "free") return null;

    const item = subscription.items.data[0];
    await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        plan_id: planId,
        status: subscription.status,
        current_period_start: item?.current_period_start
          ? new Date(item.current_period_start * 1000).toISOString()
          : null,
        current_period_end: item?.current_period_end
          ? new Date(item.current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return planId;
  } catch {
    return null;
  }
}
