import { createClient } from "@/lib/supabase/server";
import { parseFile } from "@/lib/file-parser";
import { parseLimit, rateLimitResponse } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { success, reset } = await parseLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Datoteka je obvezna" },
      { status: 400 }
    );
  }

  try {
    const result = await parseFile(file);
    return NextResponse.json({ text: result.text });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Napaka pri branju datoteke" },
      { status: 400 }
    );
  }
}
