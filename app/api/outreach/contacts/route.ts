import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["anakinfunded@gmail.com"];

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) return null;
  return user;
}

export async function GET() {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("outreach_contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const admin = createAdminClient();

  // Support single contact or batch (CSV import)
  const contacts = Array.isArray(body) ? body : [body];

  const rows = contacts.map(
    (c: { email: string; name?: string; company?: string; tags?: string[] }) => ({
      email: c.email.toLowerCase().trim(),
      name: c.name || "",
      company: c.company || "",
      tags: c.tags || [],
    })
  );

  const { data, error } = await admin
    .from("outreach_contacts")
    .upsert(rows, { onConflict: "email", ignoreDuplicates: true })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ imported: data?.length || 0 });
}
