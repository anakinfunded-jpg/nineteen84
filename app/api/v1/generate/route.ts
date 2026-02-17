import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { generateText } from "@/lib/ai/client";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";
import { templates } from "@/lib/ai/templates";
import { checkWordLimit, incrementWords, countWords, getUsage, getUserPlan } from "@/lib/credits";
import { PLANS } from "@/lib/stripe";
import { apiLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov. Počakajte." } }, { status: 429 });
    }

    const { templateId, fields } = await request.json();

    const template = templates.find((t) => t.id === templateId);
    if (!template) {
      return Response.json({ success: false, error: { code: "INVALID_TEMPLATE", message: "Neveljavna predloga.", available: templates.map((t) => t.id) } }, { status: 400 });
    }

    const missingFields = template.fields.filter((f) => f.required && !fields?.[f.id]).map((f) => f.id);
    if (missingFields.length > 0) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: `Manjkajoča polja: ${missingFields.join(", ")}` } }, { status: 400 });
    }

    const totalInput = Object.values(fields as Record<string, string>).join("").length;
    if (totalInput > 10_000) {
      return Response.json({ success: false, error: { code: "INPUT_TOO_LONG", message: "Vnos je predolg. Največja skupna dolžina polj je 10.000 znakov." } }, { status: 400 });
    }

    const withinLimit = await checkWordLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev besed dosežena." } }, { status: 403 });
    }

    const systemPrompt = buildSystemPrompt(templateId);
    const userPrompt = buildUserPrompt(templateId, fields, template);

    const text = await generateText({ systemPrompt, userPrompt, tier: "premium" });
    const words = countWords(text);
    if (words > 0) await incrementWords(apiUser.userId, words);

    const usage = await getUsage(apiUser.userId);
    const plan = PLANS[await getUserPlan(apiUser.userId)];

    return Response.json({
      success: true,
      data: { text, words },
      usage: { words_used: usage.wordsUsed, words_limit: plan.words },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
