import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

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

  const destination = url || process.env.NEXT_PUBLIC_APP_URL || "https://www.1984.si";
  return NextResponse.redirect(destination);
}
