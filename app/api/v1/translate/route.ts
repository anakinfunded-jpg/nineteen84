import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { generateText } from "@/lib/ai/client";
import { checkWordLimit, incrementWords, countWords, getUsage, getUserPlan } from "@/lib/credits";
import { PLANS } from "@/lib/stripe";
import { apiLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Si profesionalni prevajalec. Tvoja naloga je prevajanje besedil med jeziki.
Pravila:
- Prevajaj natančno in naravno
- Ohrani pomen, ton in slog izvirnika
- Ohrani oblikovanje (odstavki, seznami, naslovi)
- Vrni SAMO prevod, brez komentarjev ali pojasnil
- Prevod naj zveni naravno v ciljnem jeziku, ne kot dobesedni prevod`;

const LANGUAGES: Record<string, string> = {
  sl: "slovenščina", hr: "hrvaščina", sr: "srbščina", bs: "bosanščina",
  mk: "makedonščina", bg: "bolgarščina", hu: "madžarščina", it: "italijanščina",
  de: "nemščina", en: "angleščina", fr: "francoščina", es: "španščina",
  pt: "portugalščina", nl: "nizozemščina", da: "danščina", sv: "švedščina",
  no: "norveščina", fi: "finščina", pl: "poljščina", cs: "češčina",
  sk: "slovaščina", ro: "romunščina", el: "grščina", tr: "turščina",
  uk: "ukrajinščina", ru: "ruščina", zh: "kitajščina", ja: "japonščina",
  ko: "korejščina", ar: "arabščina",
};

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const { text, sourceLang, targetLang } = await request.json();

    if (!text || !sourceLang || !targetLang) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezna polja: text, sourceLang, targetLang" } }, { status: 400 });
    }

    if (!LANGUAGES[sourceLang] || !LANGUAGES[targetLang]) {
      return Response.json({ success: false, error: { code: "INVALID_LANGUAGE", message: "Neveljaven jezik.", available: Object.keys(LANGUAGES) } }, { status: 400 });
    }

    const withinLimit = await checkWordLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev besed dosežena." } }, { status: 403 });
    }

    const userPrompt = `Prevedi naslednje besedilo iz ${LANGUAGES[sourceLang]} v ${LANGUAGES[targetLang]}.\n\nBesedilo:\n${text}`;
    const translated = await generateText({ systemPrompt: SYSTEM_PROMPT, userPrompt, tier: "premium", maxTokens: 4096 });

    const words = countWords(translated);
    if (words > 0) await incrementWords(apiUser.userId, words);

    const usage = await getUsage(apiUser.userId);
    const plan = PLANS[await getUserPlan(apiUser.userId)];

    return Response.json({
      success: true,
      data: { text: translated, words, sourceLang, targetLang },
      usage: { words_used: usage.wordsUsed, words_limit: plan.words },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
