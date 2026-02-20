import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["1984.si", "www.1984.si"];

function sanitizeRedirectUrl(url: string | null): string {
  const fallback = process.env.NEXT_PUBLIC_APP_URL || "https://www.1984.si";
  if (!url) return fallback;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return fallback;
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) return fallback;
    return url;
  } catch {
    // Relative path — validate it
    if (!url.startsWith("/") || url.startsWith("//")) return fallback;
    return `${fallback}${url}`;
  }
}

export async function GET(request: NextRequest) {
  const sendId = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");

  if (sendId) {
    const supabase = createAdminClient();
    await supabase
      .from("outreach_sends")
      .update({ clicked_at: new Date().toISOString() })
      .eq("id", sendId)
      .is("clicked_at", null);
  }

  const destination = sanitizeRedirectUrl(url);
  return NextResponse.redirect(destination);
}
