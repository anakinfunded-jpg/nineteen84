import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { checkTtsLimit, incrementTts } from "@/lib/credits";
import { apiLimit } from "@/lib/rate-limit";
import OpenAI from "openai";

const openai = new OpenAI();

const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const { text, voice = "alloy", speed = 1.0 } = await request.json();

    if (!text) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: text" } }, { status: 400 });
    }

    if (text.length > 4096) {
      return Response.json({ success: false, error: { code: "TEXT_TOO_LONG", message: "Besedilo ne sme presegati 4096 znakov." } }, { status: 400 });
    }

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : "alloy";

    const withinLimit = await checkTtsLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev TTS dosežena." } }, { status: 403 });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      input: text,
      voice: selectedVoice,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      response_format: "mp3",
    });

    await incrementTts(apiUser.userId);

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(arrayBuffer.byteLength),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
