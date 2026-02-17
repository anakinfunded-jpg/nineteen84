import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  let supabaseOk = false;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("subscriptions").select("id").limit(1);
    supabaseOk = !error;
  } catch {
    supabaseOk = false;
  }

  const status = supabaseOk ? "ok" : "degraded";
  const statusCode = supabaseOk ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
      latency_ms: Date.now() - start,
      services: { supabase: supabaseOk ? "ok" : "error" },
    },
    { status: statusCode }
  );
}
