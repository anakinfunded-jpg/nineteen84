import { createClient } from "@/lib/supabase/server";
import { chatStream, type ChatMessage } from "@/lib/ai/client";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { conversationId, message, messages } = (await request.json()) as {
    conversationId?: string;
    message: string;
    messages: ChatMessage[];
  };

  if (!message?.trim()) {
    return new Response("Sporočilo je obvezno", { status: 400 });
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
      const client = new Anthropic();
      const titleRes = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 30,
        messages: [
          {
            role: "user",
            content: `Generiraj kratek naslov v slovenščini (3-6 besed) za ta pogovor. Vrni SAMO naslov, brez narekovajev ali ločil na koncu.\n\nSporočilo: ${message.slice(0, 200)}`,
          },
        ],
      });
      const aiTitle =
        titleRes.content[0]?.type === "text"
          ? titleRes.content[0].text.trim()
          : "";
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

  // Get tier from subscription
  const tier = await getUserTier(user.id);

  try {
    const stream = await chatStream({
      systemPrompt: CHAT_SYSTEM_PROMPT,
      messages: chatMessages,
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
