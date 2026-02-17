import { createClient } from "@/lib/supabase/server";
import { generateStream } from "@/lib/ai/client";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import { parseFile } from "@/lib/file-parser";
import { NextRequest } from "next/server";

type SummaryMode = "short" | "medium" | "detailed" | "bullets";

const MODE_INSTRUCTIONS: Record<SummaryMode, string> = {
  short:
    "Napiši kratek povzetek v približno 150 besedah. Zajemi le najpomembnejše informacije.",
  medium:
    "Napiši srednje dolg povzetek v približno 400 besedah. Zajemi vse ključne informacije in kontekst.",
  detailed:
    "Napiši podroben povzetek v približno 800 besedah. Vključi vse pomembne podrobnosti, argumente in zaključke.",
  bullets:
    "Napiši povzetek v obliki ključnih točk (alinej). Uporabi oznake • za vsako točko. Zajemi vse pomembne informacije sistematično.",
};

const SYSTEM_PROMPT = `Si strokovnjak za povzemanje besedil v slovenščini.
Pravila:
- Vedno odgovarjaj v slovenščini z upoštevanjem slovničnih pravil
- Povzetek mora biti jasen, jedrnaten in informativen
- Ohrani ključne informacije, podatke in zaključke iz izvirnika
- Piši v brezhibni slovenščini
- Ne dodajaj informacij, ki jih ni v izvirnem besedilu`;

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
  let mode: SummaryMode = "medium";

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    mode = (formData.get("mode") as SummaryMode) || "medium";

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
    mode = body.mode || "medium";
  }

  if (!text?.trim()) {
    return new Response("Besedilo je obvezno", { status: 400 });
  }

  if (text.length > 100_000) {
    return new Response("Besedilo je predolgo. Največja dolžina je 100.000 znakov.", { status: 400 });
  }

  if (!MODE_INSTRUCTIONS[mode]) {
    return new Response("Neveljaven način povzemanja", { status: 400 });
  }

  const tier = await getUserTier(user.id);

  try {
    const stream = await generateStream({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: `${MODE_INSTRUCTIONS[mode]}\n\nBesedilo za povzemanje:\n${text}`,
      tier,
      maxTokens: 4096,
    });

    let fullResponse = "";
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullResponse += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          const words = countWords(fullResponse);
          if (words > 0) {
            await incrementWords(user.id, words);
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Napaka pri ustvarjanju povzetka.", { status: 500 });
  }
}
