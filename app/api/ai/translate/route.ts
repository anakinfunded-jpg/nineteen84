import { createClient } from "@/lib/supabase/server";
import { generateStream } from "@/lib/ai/client";
import { getUserTier } from "@/lib/credits";
import { checkWordLimit, incrementWords, countWords } from "@/lib/credits";
import { NextRequest } from "next/server";

const LANGUAGES: Record<string, string> = {
  // Balkanski in sosednji jeziki
  sl: "slovenščina",
  hr: "hrvaščina",
  sr: "srbščina",
  bs: "bosanščina",
  mk: "makedonščina",
  bg: "bolgarščina",
  hu: "madžarščina",
  it: "italijanščina",
  de: "nemščina",
  at: "avstrijska nemščina",
  // Zahodni jeziki
  en: "angleščina",
  fr: "francoščina",
  es: "španščina",
  pt: "portugalščina",
  nl: "nizozemščina",
  // Skandinavski jeziki
  da: "danščina",
  sv: "švedščina",
  no: "norveščina",
  fi: "finščina",
  is: "islandščina",
  // Srednjeevropski jeziki
  pl: "poljščina",
  cs: "češčina",
  sk: "slovaščina",
  ro: "romunščina",
  // Drugi evropski jeziki
  el: "grščina",
  tr: "turščina",
  uk: "ukrajinščina",
  ru: "ruščina",
  lt: "litovščina",
  lv: "latvijščina",
  et: "estonščina",
  ga: "irščina",
  // Azijski jeziki
  zh: "kitajščina",
  ja: "japonščina",
  ko: "korejščina",
  hi: "hindijščina",
  ar: "arabščina",
  he: "hebrejščina",
  th: "tajščina",
  vi: "vietnamščina",
  id: "indonezijščina",
  ms: "malajščina",
  // Ostalo
  ka: "gruzijščina",
  sq: "albanščina",
  sw: "svahili",
  la: "latinščina",
};

const SYSTEM_PROMPT = `Si profesionalni prevajalec. Tvoja naloga je prevajanje besedil med jeziki.
Pravila:
- Prevajaj natančno in naravno
- Ohrani pomen, ton in slog izvirnika
- Ohrani oblikovanje (odstavki, seznami, naslovi)
- Vrni SAMO prevod, brez komentarjev ali pojasnil
- Prevod naj zveni naravno v ciljnem jeziku, ne kot dobesedni prevod
- Ne uporabi markdown oblikovanja (brez #, ##, **, __ ipd.) — vrni čist prevod`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Neavtorizirano", { status: 401 });
  }

  const { text, sourceLang, targetLang } = await request.json();

  if (!text || !sourceLang || !targetLang) {
    return new Response("Besedilo in jeziki so obvezni", { status: 400 });
  }

  if (!LANGUAGES[sourceLang] || !LANGUAGES[targetLang]) {
    return new Response("Neveljaven jezik", { status: 400 });
  }

  if (sourceLang === targetLang) {
    return new Response("Izvorni in ciljni jezik morata biti različna", {
      status: 400,
    });
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
      userPrompt: `Prevedi naslednje besedilo iz ${LANGUAGES[sourceLang]} v ${LANGUAGES[targetLang]}.\n\nBesedilo:\n${text}`,
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
    return new Response("Napaka pri prevajanju.", { status: 500 });
  }
}
