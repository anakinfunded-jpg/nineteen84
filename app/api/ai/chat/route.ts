import { createClient } from "@/lib/supabase/server";
import { chatStream, generateText, CHAT_MODEL, type ChatMessage } from "@/lib/ai/client";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { aiTextLimit, rateLimitResponse } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

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

  const { conversationId, message, messages } = (await request.json()) as {
    conversationId?: string;
    message: string;
    messages: ChatMessage[];
  };

  if (!message?.trim()) {
    return new Response("Sporočilo je obvezno", { status: 400 });
  }

  if (message.length > 30_000) {
    return new Response("Sporočilo je predolgo. Največja dolžina je 30.000 znakov.", { status: 400 });
  }

  // Check word limit
  const withinLimit = await checkWordLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev besed. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  let convId = conversationId;
  let generatedTitle: string | null = null;

  // Create new conversation if none provided
  if (!convId) {
    // Use a quick AI call to generate a short topic title
    const fallbackTitle =
      message.slice(0, 60) + (message.length > 60 ? "…" : "");
    let title = fallbackTitle;

    try {
      const aiTitle = await generateText({
        systemPrompt: "Generiraj kratek naslov v slovenščini (3-6 besed). Vrni SAMO naslov, brez narekovajev ali ločil.",
        userPrompt: message.slice(0, 200),
        model: CHAT_MODEL,
        maxTokens: 30,
      });
      if (aiTitle && aiTitle.length <= 80) {
        title = aiTitle;
      }
    } catch {
      // fallback to truncated message
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (error || !data) {
      return new Response("Napaka pri ustvarjanju pogovora", { status: 500 });
    }
    convId = data.id;
    generatedTitle = title;
  }

  // Save user message
  await supabase.from("messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  // Build message history for the model
  const chatMessages: ChatMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  chatMessages.push({ role: "user", content: message });

  try {
    const stream = await chatStream({
      systemPrompt: CHAT_SYSTEM_PROMPT,
      messages: chatMessages,
      model: CHAT_MODEL,
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

          // Save assistant message after streaming completes
          await supabase.from("messages").insert({
            conversation_id: convId,
            role: "assistant",
            content: fullResponse,
          });

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

    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": convId!,
    };
    if (generatedTitle) {
      headers["X-Conversation-Title"] = encodeURIComponent(generatedTitle);
    }

    return new Response(readable, { headers });
  } catch {
    return new Response("Napaka pri generiranju odgovora.", { status: 500 });
  }
}
