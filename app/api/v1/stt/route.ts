import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { checkSttLimit, incrementStt } from "@/lib/credits";
import { apiLimit } from "@/lib/rate-limit";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const formData = await request.formData();
    const audio = formData.get("audio") as File | null;
    const language = (formData.get("language") as string) || "sl";

    if (!audio) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: audio (datoteka)" } }, { status: 400 });
    }

    if (audio.size > 25 * 1024 * 1024) {
      return Response.json({ success: false, error: { code: "FILE_TOO_LARGE", message: "Datoteka ne sme presegati 25 MB." } }, { status: 400 });
    }

    const withinLimit = await checkSttLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev STT dosežena." } }, { status: 403 });
    }

    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: audio,
      language,
      response_format: "text",
    });

    await incrementStt(apiUser.userId);

    return Response.json({
      success: true,
      data: { text: transcription },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
