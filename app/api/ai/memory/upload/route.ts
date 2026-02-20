import { createClient } from "@/lib/supabase/server";
import { storeDocument } from "@/lib/ai/embeddings";
import { checkDocumentLimit } from "@/lib/credits";
import { memoryLimit, rateLimitResponse } from "@/lib/rate-limit";
import { parseFile } from "@/lib/file-parser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { success, reset } = await memoryLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const withinLimit = await checkDocumentLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste omejitev dokumentov. Izbrišite stare ali nadgradite paket." },
      { status: 403 }
    );
  }

  let title: string;
  let content: string;

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    title = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "Datoteka je obvezna" },
        { status: 400 }
      );
    }

    try {
      const parsed = await parseFile(file);
      content = parsed.text;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Napaka pri branju datoteke";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!title.trim()) {
      title = file.name.replace(/\.[^.]+$/, "");
    }
  } else {
    const body = (await request.json()) as { title: string; content: string };
    title = body.title;
    content = body.content;
  }

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Naslov in vsebina sta obvezna" },
      { status: 400 }
    );
  }

  if (content.length > 200_000) {
    return NextResponse.json(
      { error: "Dokument je predolg. Največja dolžina je 200.000 znakov." },
      { status: 400 }
    );
  }

  try {
    const docId = await storeDocument(user.id, title, content);
    return NextResponse.json({ id: docId });
  } catch (err) {
    console.error("[ai/memory/upload] error:", err);
    return NextResponse.json({ error: "Napaka pri shranjevanju dokumenta" }, { status: 500 });
  }
}
