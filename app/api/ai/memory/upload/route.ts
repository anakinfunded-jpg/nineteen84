import { createClient } from "@/lib/supabase/server";
import { storeDocument } from "@/lib/ai/embeddings";
import { checkDocumentLimit } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { title, content } = (await request.json()) as {
    title: string;
    content: string;
  };

  const withinLimit = await checkDocumentLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste omejitev dokumentov. Izbrišite stare ali nadgradite paket." },
      { status: 403 }
    );
  }

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Naslov in vsebina sta obvezna" },
      { status: 400 }
    );
  }

  if (content.length > 100_000) {
    return NextResponse.json(
      { error: "Dokument je predolg. Največja dolžina je 100.000 znakov." },
      { status: 400 }
    );
  }

  try {
    const docId = await storeDocument(user.id, title, content);
    return NextResponse.json({ id: docId });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Napaka pri shranjevanju dokumenta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
