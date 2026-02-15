import { createClient } from "@/lib/supabase/server";
import { queryDocuments } from "@/lib/ai/embeddings";
import { getUserTier, checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const MODELS = {
  free: "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-4-5-20250929",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { query } = (await request.json()) as { query: string };

  if (!query?.trim()) {
    return new Response("Vprašanje je obvezno", { status: 400 });
  }

  const withinLimit = await checkWordLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev besed. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  try {
    // Find relevant document chunks
    const chunks = await queryDocuments(user.id, query, 5);

    if (chunks.length === 0) {
      return new Response(
        "Nisem našel ustreznih dokumentov. Najprej naložite dokumente v AI Spomin.",
        { status: 200 }
      );
    }

    const context = chunks.map((c) => c.content).join("\n\n---\n\n");
    const tier = await getUserTier(user.id);

    const client = new Anthropic();
    const stream = await client.messages.create({
      model: MODELS[tier],
      max_tokens: 4096,
      system:
        "Si pomočnik, ki odgovarja na vprašanja na podlagi uporabnikovih dokumentov. " +
        "Odgovarjaj v slovenščini. Če informacija ni v kontekstu, to jasno povej. " +
        "Navajaj vire (iz katerega dela dokumenta izhaja odgovor).",
      messages: [
        {
          role: "user",
          content: `Kontekst iz mojih dokumentov:\n\n${context}\n\n---\n\nVprašanje: ${query}`,
        },
      ],
      stream: true,
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
    return new Response("Napaka pri iskanju v dokumentih.", { status: 500 });
  }
}
