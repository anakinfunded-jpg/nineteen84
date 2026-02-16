import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { code, full_name, phone, instagram, tiktok, youtube, linkedin, website, audience_size, niche, promo_plan } = await request.json();

  if (!code || typeof code !== "string" || code.length < 3 || code.length > 30) {
    return NextResponse.json(
      { error: "Koda mora imeti 3-30 znakov." },
      { status: 400 }
    );
  }

  // Validate code format: alphanumeric + hyphens only
  if (!/^[a-z0-9-]+$/.test(code.toLowerCase())) {
    return NextResponse.json(
      { error: "Koda lahko vsebuje samo male črke, številke in vezaje." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check if user already has an affiliate account
  const { data: existing } = await admin
    .from("affiliates")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Že imate partnerski račun.", status: existing.status },
      { status: 409 }
    );
  }

  // Check if code is taken
  const { data: codeTaken } = await admin
    .from("affiliates")
    .select("id")
    .eq("code", code.toLowerCase())
    .single();

  if (codeTaken) {
    return NextResponse.json(
      { error: "Ta koda je že zasedena. Izberite drugo." },
      { status: 409 }
    );
  }

  // Create affiliate
  const { data, error } = await admin.from("affiliates").insert({
    user_id: user.id,
    code: code.toLowerCase(),
    full_name: full_name || null,
    phone: phone || null,
    instagram: instagram || null,
    tiktok: tiktok || null,
    youtube: youtube || null,
    linkedin: linkedin || null,
    website: website || null,
    audience_size: audience_size || null,
    niche: niche || null,
    promo_plan: promo_plan || null,
  }).select().single();

  if (error) {
    return NextResponse.json(
      { error: "Napaka pri ustvarjanju. Poskusite znova." },
      { status: 500 }
    );
  }

  return NextResponse.json({ affiliate: data });
}
