import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import { parseFile } from "@/lib/file-parser";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ModelTier } from "@/lib/ai/client";

type StudyMode = "flashcards" | "quiz" | "test";

const MODELS: Record<ModelTier, string> = {
  free: "claude-sonnet-4-5-20250929",
  premium: "claude-opus-4-6",
};

const MODE_PROMPTS: Record<StudyMode, string> = {
  flashcards: `Ustvari 8–15 učnih kartic na podlagi podanega besedila.
Vrni SAMO veljaven JSON v naslednji obliki (brez markdown ograj):
{"cards":[{"front":"vprašanje","back":"odgovor"}]}

Pravila:
- Vprašanja naj bodo jasna in specifična
- Odgovori naj bodo jedrnati, a popolni
- Pokrij najpomembnejše koncepte iz besedila
- Piši v slovenščini`,

  quiz: `Ustvari 8–12 vprašanj z izbirnimi odgovori na podlagi podanega besedila.
Vrni SAMO veljaven JSON v naslednji obliki (brez markdown ograj):
{"questions":[{"question":"vprašanje","options":["A","B","C","D"],"correct":0,"explanation":"razlaga"}]}

Pravila:
- Vsako vprašanje ima 4 možne odgovore
- "correct" je indeks pravilnega odgovora (0–3)
- Vključi kratko razlago za vsak pravilen odgovor
- Vprašanja naj testirajo razumevanje, ne le pomnjenje
- Piši v slovenščini`,

  test: `Ustvari 8–12 vprašanj z odprtimi odgovori na podlagi podanega besedila.
Vrni SAMO veljaven JSON v naslednji obliki (brez markdown ograj):
{"questions":[{"question":"vprašanje","answer":"pričakovan odgovor"}]}

Pravila:
- Vprašanja naj zahtevajo poglobljen odgovor
- Odgovori naj bodo izčrpni, a jedrnati
- Pokrij ključne teme iz besedila
- Piši v slovenščini`,
};

const SYSTEM_PROMPT = `Si strokovnjak za ustvarjanje učnega gradiva v slovenščini.
Pravila:
- Vedno odgovarjaj v slovenščini z upoštevanjem slovničnih pravil
- Vrni SAMO veljaven JSON, brez markdown ograj ali drugega besedila
- Ustvari kakovostno učno gradivo, ki pomaga pri učenju`;

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { success, reset } = await aiTextLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const withinLimit = await checkWordLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev besed. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  let text: string;
  let mode: StudyMode = "flashcards";

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    mode = (formData.get("mode") as StudyMode) || "flashcards";

    if (!file) {
      return new Response("Datoteka je obvezna", { status: 400 });
    }

    try {
      const parsed = await parseFile(file);
      text = parsed.text;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Napaka pri branju datoteke";
      return new Response(message, { status: 400 });
    }
  } else {
    const body = await request.json();
    text = body.text;
    mode = body.mode || "flashcards";
  }

  if (!text?.trim()) {
    return new Response("Besedilo je obvezno", { status: 400 });
  }

  if (!MODE_PROMPTS[mode]) {
    return new Response("Neveljaven način", { status: 400 });
  }

  const tier = await getUserTier(user.id);
  const client = getClient();

  try {
    const response = await client.messages.create({
      model: MODELS[tier],
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${MODE_PROMPTS[mode]}\n\nBesedilo:\n${text}`,
        },
      ],
    });

    let jsonText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Strip markdown code fences if present
    jsonText = jsonText
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    const words = countWords(jsonText);
    if (words > 0) {
      await incrementWords(user.id, words);
    }

    const data = JSON.parse(jsonText);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return new Response(
        "Napaka pri obdelavi odgovora. Poskusite znova.",
        { status: 500 }
      );
    }
    return new Response("Napaka pri ustvarjanju učnega gradiva.", {
      status: 500,
    });
  }
}
