import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: NextRequest) {
  const sendId = request.nextUrl.searchParams.get("id");

  if (sendId) {
    const supabase = createAdminClient();
    await supabase
      .from("outreach_sends")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", sendId)
      .is("opened_at", null);
  }

  return new Response(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
