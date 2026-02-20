import { createClient } from "@/lib/supabase/server";
import { checkSttLimit, incrementStt } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI();

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

  const withinLimit = await checkSttLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste mesečno omejitev prepisovanja zvoka. Nadgradite paket za več." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("audio") as File | null;
  const language = (formData.get("language") as string) || "sl";

  if (!file) {
    return NextResponse.json(
      { error: "Zvočna datoteka je obvezna" },
      { status: 400 }
    );
  }

  // Max 25 MB (OpenAI Whisper limit)
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Datoteka je prevelika. Največja velikost je 25 MB." },
      { status: 400 }
    );
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: file,
      language,
      response_format: "text",
    });

    await incrementStt(user.id);

    return NextResponse.json({ text: transcription });
  } catch (err) {
    console.error("[ai/stt] error:", err);
    return NextResponse.json({ error: "Napaka pri prepisovanju zvoka" }, { status: 500 });
  }
}
