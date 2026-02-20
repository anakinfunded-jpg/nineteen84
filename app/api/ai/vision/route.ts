import { createClient } from "@/lib/supabase/server";
import { getUserTier, checkOcrLimit, incrementOcr } from "@/lib/credits";
import { incrementWords, countWords } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const MODELS = {
  free: "claude-sonnet-4-5-20250929",
  premium: "claude-opus-4-6",
};

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

  const formData = await request.formData();
  const file = formData.get("image") as File | null;
  const imageUrl = formData.get("imageUrl") as string | null;
  const mode = (formData.get("mode") as string) || "describe";

  if (!file && !imageUrl) {
    return new Response("Slika je obvezna", { status: 400 });
  }

  if (file && file.size > 10 * 1024 * 1024) {
    return new Response("Slika je prevelika. Največja velikost je 10 MB.", { status: 400 });
  }

  const withinLimit = await checkOcrLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev analiz slik. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  const tier = await getUserTier(user.id);

  // Build image content block
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  let imageContent: Anthropic.ImageBlockParam;
  if (file) {
    if (!allowedImageTypes.includes(file.type)) {
      return new Response("Nepodprt format slike. Dovoljeni: JPEG, PNG, GIF, WebP.", { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/gif"
      | "image/webp";
    imageContent = {
      type: "image",
      source: { type: "base64", media_type: mediaType, data: base64 },
    };
  } else {
    imageContent = {
      type: "image",
      source: { type: "url", url: imageUrl! },
    };
  }

  const systemPrompt =
    mode === "ocr"
      ? "Si OCR sistem. Natančno izvleci VSE besedilo iz slike. Ohrani formatiranje (odstavke, sezname, tabele). Vrni samo izvlečeno besedilo brez komentarjev. Ne uporabljaj markdown oblikovanja."
      : "Si vizualni asistent. Natančno opiši sliko v slovenščini. Piši v brezhibni slovenščini z upoštevanjem slovničnih pravil (skloni, spol, glagolski vid, dvojina). Vključi podrobnosti o vsebini, barvah, kompoziciji in razpoloženju slike. Oblikuj opis z odstavki za berljivost. Ne uporabljaj markdown oblikovanja (brez #, ##, **, __ ipd.).";

  try {
    const client = new Anthropic();
    const stream = await client.messages.create({
      model: MODELS[tier],
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            imageContent,
            {
              type: "text",
              text:
                mode === "ocr"
                  ? "Izvleci vse besedilo iz te slike."
                  : "Opiši to sliko podrobno v slovenščini.",
            },
          ],
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
          await incrementOcr(user.id);

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
    return new Response("Napaka pri analizi slike.", { status: 500 });
  }
}
