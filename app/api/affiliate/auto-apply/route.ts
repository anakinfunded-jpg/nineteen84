import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  // Check for pending affiliate data in user metadata
  const pending = user.user_metadata?.pending_affiliate;
  if (!pending || !pending.code) {
    return NextResponse.json({ error: "Ni podatkov za prijavo" }, { status: 404 });
  }

  const { code, full_name, phone, instagram, tiktok, youtube, linkedin, website, audience_size, niche, promo_plan } = pending;

  // Validate code
  if (!code || typeof code !== "string" || code.length < 3 || code.length > 30) {
    return NextResponse.json({ error: "Neveljavna koda" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Check if already has affiliate account
  const { data: existing } = await admin
    .from("affiliates")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Clear metadata since it's no longer needed
    await supabase.auth.updateUser({ data: { pending_affiliate: null } });
    return NextResponse.json({ error: "Že imate partnerski račun.", status: existing.status }, { status: 409 });
  }

  // Check if code is taken
  const { data: codeTaken } = await admin
    .from("affiliates")
    .select("id")
    .eq("code", code.toLowerCase())
    .single();

  if (codeTaken) {
    return NextResponse.json({ error: "Ta koda je že zasedena." }, { status: 409 });
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
    return NextResponse.json({ error: "Napaka pri ustvarjanju." }, { status: 500 });
  }

  // Clear pending data from metadata
  await supabase.auth.updateUser({ data: { pending_affiliate: null } });

  return NextResponse.json({ affiliate: data });
}
