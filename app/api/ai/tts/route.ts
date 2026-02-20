import { createClient } from "@/lib/supabase/server";
import { checkTtsLimit, incrementTts } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI();

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { success, reset } = await aiTextLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const { text, voice, speed } = (await request.json()) as {
    text: string;
    voice?: Voice;
    speed?: number;
  };

  if (!text?.trim()) {
    return NextResponse.json(
      { error: "Besedilo je obvezno" },
      { status: 400 }
    );
  }

  if (text.length > 4096) {
    return NextResponse.json(
      { error: "Besedilo je predolgo. Največja dolžina je 4096 znakov." },
      { status: 400 }
    );
  }

  const withinLimit = await checkTtsLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste mesečno omejitev generiranja zvoka. Nadgradite paket za več." },
      { status: 403 }
    );
  }

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      input: text,
      voice: voice || "alloy",
      speed: Math.max(0.25, Math.min(4.0, speed || 1.0)),
      response_format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    await incrementTts(user.id);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[ai/tts] error:", err);
    return NextResponse.json({ error: "Napaka pri generiranju zvoka" }, { status: 500 });
  }
}
