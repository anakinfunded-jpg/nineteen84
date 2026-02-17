import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { generateText } from "@/lib/ai/client";
import { checkWordLimit, incrementWords, countWords, getUsage, getUserPlan } from "@/lib/credits";
import { PLANS } from "@/lib/stripe";
import { apiLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Si strokovnjak za povzemanje besedil v slovenščini.
Pravila:
- Vedno odgovarjaj v slovenščini z upoštevanjem slovničnih pravil
- Povzetek mora biti jasen, jedrnaten in informativen
- Ohrani ključne informacije, podatke in zaključke iz izvirnika
- Piši v brezhibni slovenščini
- Ne dodajaj informacij, ki jih ni v izvirnem besedilu`;

const MODE_INSTRUCTIONS: Record<string, string> = {
  short: "Napiši kratek povzetek v približno 150 besedah. Zajemi le najpomembnejše informacije.",
  medium: "Napiši srednje dolg povzetek v približno 400 besedah. Zajemi vse ključne informacije in kontekst.",
  detailed: "Napiši podroben povzetek v približno 800 besedah. Vključi vse pomembne podrobnosti, argumente in zaključke.",
  bullets: "Napiši povzetek v obliki ključnih točk (alinej). Uporabi oznake • za vsako točko. Zajemi vse pomembne informacije sistematično.",
};

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const { text, mode = "medium" } = await request.json();

    if (!text) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: text" } }, { status: 400 });
    }

    if (text.length > 100_000) {
      return Response.json({ success: false, error: { code: "INPUT_TOO_LONG", message: "Besedilo je predolgo. Največja dolžina je 100.000 znakov." } }, { status: 400 });
    }

    if (!MODE_INSTRUCTIONS[mode]) {
      return Response.json({ success: false, error: { code: "INVALID_MODE", message: "Veljavni načini: short, medium, detailed, bullets" } }, { status: 400 });
    }

    const withinLimit = await checkWordLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev besed dosežena." } }, { status: 403 });
    }

    const userPrompt = `${MODE_INSTRUCTIONS[mode]}\n\nBesedilo za povzemanje:\n${text}`;
    const summary = await generateText({ systemPrompt: SYSTEM_PROMPT, userPrompt, tier: "premium", maxTokens: 4096 });

    const words = countWords(summary);
    if (words > 0) await incrementWords(apiUser.userId, words);

    const usage = await getUsage(apiUser.userId);
    const plan = PLANS[await getUserPlan(apiUser.userId)];

    return Response.json({
      success: true,
      data: { text: summary, words, mode },
      usage: { words_used: usage.wordsUsed, words_limit: plan.words },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
