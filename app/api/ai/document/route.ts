import { createClient } from "@/lib/supabase/server";
import { generateStream } from "@/lib/ai/client";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { NextRequest } from "next/server";

const ACTIONS: Record<string, { label: string; prompt: string }> = {
  improve: {
    label: "Izboljšaj",
    prompt:
      "Izboljšaj naslednje besedilo. Popravi slovnico, izboljšaj berljivost, jasnost in profesionalnost. Ohrani pomen in ton besedila.",
  },
  shorten: {
    label: "Skrajšaj",
    prompt:
      "Skrajšaj naslednje besedilo. Ohrani bistvene informacije, a odstrani nepotrebne besede in ponavljanje. Besedilo naj bo jedrnato in jasno.",
  },
  expand: {
    label: "Razširi",
    prompt:
      "Razširi naslednje besedilo z dodatnimi podrobnostmi, primeri in razlagami. Ohrani slog in ton izvirnika.",
  },
  formalize: {
    label: "Formaliziraj",
    prompt:
      "Preoblikuj naslednje besedilo v formalen, poslovni slog. Uporabi vljudnostne oblike in strokovno terminologijo.",
  },
  simplify: {
    label: "Poenostavi",
    prompt:
      "Poenostavi naslednje besedilo. Uporabi krajše stavke, enostavnejše besede in jasnejšo strukturo. Besedilo naj bo razumljivo vsakomur.",
  },
  proofread: {
    label: "Lektoriraj",
    prompt:
      "Lektoriraj naslednje besedilo. Popravi vse slovnične, pravopisne in slogovne napake. Vrni popravljeno besedilo.",
  },
};

const SYSTEM_PROMPT = `Si profesionalni slovenski lektor in pisec. Tvoja naloga je obdelava besedil v slovenščini.
Pravila:
- Vedno odgovarjaj v slovenščini
- Ohrani oblikovanje (odstavki, seznami, naslovi)
- Vrni SAMO obdelano besedilo, brez komentarjev ali pojasnil
- Piši v brezhibni slovenščini`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { text, action } = await request.json();

  if (!text || !action) {
    return new Response("Besedilo in dejanje sta obvezna", { status: 400 });
  }

  const actionConfig = ACTIONS[action];
  if (!actionConfig) {
    return new Response("Neveljavno dejanje", { status: 400 });
  }

  const withinLimit = await checkWordLimit(user.id);
  if (!withinLimit) {
    return new Response(
      "Dosegli ste mesečno omejitev besed. Nadgradite paket za več.",
      { status: 403 }
    );
  }

  const tier = await getUserTier(user.id);

  try {
    const stream = await generateStream({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: `${actionConfig.prompt}\n\nBesedilo:\n${text}`,
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
    return new Response("Napaka pri obdelavi dokumenta.", { status: 500 });
  }
}
