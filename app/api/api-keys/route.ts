import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/credits";
import { generateApiKey, revokeApiKey, listApiKeys, countApiKeys } from "@/lib/api/keys";
import { NextResponse } from "next/server";

const MAX_KEYS = 3;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });

  const planId = await getUserPlan(user.id);
  if (planId !== "poslovno") {
    return NextResponse.json({ error: "API dostop je na voljo samo za Poslovni paket." }, { status: 403 });
  }

  const keys = await listApiKeys(user.id);
  return NextResponse.json({ keys });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });

  const planId = await getUserPlan(user.id);
  if (planId !== "poslovno") {
    return NextResponse.json({ error: "API dostop je na voljo samo za Poslovni paket." }, { status: 403 });
  }

  const count = await countApiKeys(user.id);
  if (count >= MAX_KEYS) {
    return NextResponse.json(
      { error: `Dosežena omejitev ${MAX_KEYS} API ključev. Izbrišite obstoječega pred ustvarjanjem novega.` },
      { status: 400 }
    );
  }

  const { name } = await request.json();
  const result = await generateApiKey(user.id, name || "");

  return NextResponse.json({
    key: result.key,
    prefix: result.prefix,
    id: result.id,
    message: "Shranite ta ključ — po zaprtju okna ga ne bo mogoče več videti.",
  });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });

  const { keyId } = await request.json();
  if (!keyId) return NextResponse.json({ error: "Manjka keyId." }, { status: 400 });

  const success = await revokeApiKey(user.id, keyId);
  if (!success) return NextResponse.json({ error: "Ključ ni bil najden." }, { status: 404 });

  return NextResponse.json({ success: true });
}
