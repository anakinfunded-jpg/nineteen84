import { createClient } from "@/lib/supabase/server";
import { generateStream } from "@/lib/ai/client";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";
import { templates } from "@/lib/ai/templates";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { success, reset } = await aiTextLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  // Parse body
  const { templateId, fields } = await request.json();

  // Validate template
  const template = templates.find((t) => t.id === templateId);
  if (!template) {
    return new Response("Neveljavna predloga", { status: 400 });
  }

  // Check required fields
  const missingFields = template.fields
    .filter((f) => f.required && !fields[f.id])
    .map((f) => f.label);

  if (missingFields.length > 0) {
    return new Response(`Manjkajoča polja: ${missingFields.join(", ")}`, {
      status: 400,
    });
  }

  // Cap total input length to prevent excessive token costs
  const totalInput = Object.values(fields as Record<string, string>).join("").length;
  if (totalInput > 10_000) {
    return new Response("Vnos je predolg. Največja skupna dolžina polj je 10.000 znakov.", { status: 400 });
  }

  // Check word limit
  const withinLimit = await checkWordLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev besed. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  // Build prompts
  const systemPrompt = buildSystemPrompt(templateId);
  const userPrompt = buildUserPrompt(templateId, fields, template);

  // Get tier from subscription
  const tier = await getUserTier(user.id);

  try {
    const stream = await generateStream({
      systemPrompt,
      userPrompt,
      tier,
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

          // Track word usage
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
    return new Response("Napaka pri generiranju vsebine.", { status: 500 });
  }
}
