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

    // Delete user data from all tables
    await admin.from("messages").delete().eq("conversation_id",
      admin.from("conversations").select("id").eq("user_id", user.id)
    );
    await admin.from("conversations").delete().eq("user_id", user.id);
    await admin.from("document_chunks").delete().in("document_id",
      (await admin.from("documents").select("id").eq("user_id", user.id)).data?.map(d => d.id) || []
    );
    await admin.from("documents").delete().eq("user_id", user.id);
    await admin.from("user_usage").delete().eq("user_id", user.id);
    await admin.from("subscriptions").delete().eq("user_id", user.id);

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
