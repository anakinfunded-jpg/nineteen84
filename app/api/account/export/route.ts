import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    // Gather all user data in parallel
    const [subResult, usageResult, convosResult, docsResult, notifsResult, imagesResult, keysResult] =
      await Promise.all([
        admin
          .from("subscriptions")
          .select("plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at")
          .eq("user_id", user.id)
          .maybeSingle(),
        admin
          .from("user_usage")
          .select("period, words_used, images_used, tts_used, stt_used, ocr_used, inpainting_used")
          .eq("user_id", user.id)
          .order("period", { ascending: false }),
        admin
          .from("conversations")
          .select("id, title, created_at, messages(role, content, created_at)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        admin
          .from("documents")
          .select("id, title, source, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        admin
          .from("notification_log")
          .select("type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        admin
          .from("generated_images")
          .select("id, prompt, image_url, size, quality, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        admin
          .from("api_keys")
          .select("id, name, created_at, last_used_at, is_active")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        provider: user.app_metadata?.provider || "email",
        created_at: user.created_at,
      },
      subscription: subResult.data || null,
      usage: usageResult.data || [],
      conversations: convosResult.data || [],
      documents: docsResult.data || [],
      generated_images: imagesResult.data || [],
      api_keys: keysResult.data || [],
      notifications: notifsResult.data || [],
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="1984-export-${user.id.slice(0, 8)}.json"`,
      },
    });
  } catch (err) {
    console.error("Data export error:", err);
    return NextResponse.json(
      { error: "Napaka pri izvozu podatkov" },
      { status: 500 }
    );
  }
}
