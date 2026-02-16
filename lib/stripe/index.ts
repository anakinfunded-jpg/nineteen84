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
    words: 1_000,
    images: 5,
    tts: 5,
    stt: 5,
    ocr: 10,
    inpainting: 3,
    documents: 5,
    tier: "free",
    features: [
      "1.000 besed",
      "5 slik",
      "AI Chat",
      "3 predloge",
    ],
  },
  osnovno: {
    name: "Osnovno",
    priceId: process.env.STRIPE_PRICE_OSNOVNO || null,
    priceEur: "14,90",
    words: 20_000,
    images: 200,
    tts: 50,
    stt: 30,
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
    priceEur: "24,90",
    words: 50_000,
    images: 500,
    tts: 200,
    stt: 120,
    ocr: 500,
    inpainting: 100,
    documents: 100,
    tier: "premium",
    features: [
      "50.000 besed",
      "500 slik",
      "Vse predloge",
      "Visoka kakovost (Sonnet)",
      "Prednostna podpora",
    ],
  },
  poslovno: {
    name: "Poslovno",
    priceId: process.env.STRIPE_PRICE_POSLOVNO || null,
    priceEur: "39,90",
    words: 100_000,
    images: 1_000,
    tts: 999_999,
    stt: 999_999,
    ocr: 999_999,
    inpainting: 999_999,
    documents: 999_999,
    tier: "premium",
    features: [
      "100.000 besed",
      "1.000 slik",
      "API dostop",
      "Lastni podatki",
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
