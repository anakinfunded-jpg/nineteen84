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
