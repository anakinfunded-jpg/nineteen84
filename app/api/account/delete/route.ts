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

  try {
    const admin = createAdminClient();

    // Get conversation IDs first, then delete messages
    const { data: convos } = await admin
      .from("conversations")
      .select("id")
      .eq("user_id", user.id);
    const convoIds = convos?.map((c) => c.id) || [];
    if (convoIds.length > 0) {
      await admin.from("messages").delete().in("conversation_id", convoIds);
    }
    await admin.from("conversations").delete().eq("user_id", user.id);

    // Get document IDs first, then delete chunks
    const { data: docs } = await admin
      .from("documents")
      .select("id")
      .eq("user_id", user.id);
    const docIds = docs?.map((d) => d.id) || [];
    if (docIds.length > 0) {
      await admin.from("document_chunks").delete().in("document_id", docIds);
    }
    await admin.from("documents").delete().eq("user_id", user.id);

    // Delete remaining user data
    await admin.from("user_usage").delete().eq("user_id", user.id);
    await admin.from("api_keys").delete().eq("user_id", user.id);
    await admin.from("subscriptions").delete().eq("user_id", user.id);
    await admin.from("notification_log").delete().eq("user_id", user.id);

    // Delete the auth user
    await admin.auth.admin.deleteUser(user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account deletion error:", err);
    return NextResponse.json(
      { error: "Napaka pri brisanju računa" },
      { status: 500 }
    );
  }
}
