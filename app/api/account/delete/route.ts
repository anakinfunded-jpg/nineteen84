import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
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

    // 1. Cancel Stripe subscription before deleting DB records
    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (sub?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      } catch {
        // Subscription may already be canceled — continue with deletion
      }
    }

    // 2. Delete generated images from storage + database
    const { data: images } = await admin
      .from("generated_images")
      .select("storage_path")
      .eq("user_id", user.id);

    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path).filter(Boolean);
      if (paths.length > 0) {
        await admin.storage.from("generated-images").remove(paths);
      }
    }
    await admin.from("generated_images").delete().eq("user_id", user.id);

    // 3. Delete conversations and messages
    const { data: convos } = await admin
      .from("conversations")
      .select("id")
      .eq("user_id", user.id);
    const convoIds = convos?.map((c) => c.id) || [];
    if (convoIds.length > 0) {
      await admin.from("messages").delete().in("conversation_id", convoIds);
    }
    await admin.from("conversations").delete().eq("user_id", user.id);

    // 4. Delete documents and chunks
    const { data: docs } = await admin
      .from("documents")
      .select("id")
      .eq("user_id", user.id);
    const docIds = docs?.map((d) => d.id) || [];
    if (docIds.length > 0) {
      await admin.from("document_chunks").delete().in("document_id", docIds);
    }
    await admin.from("documents").delete().eq("user_id", user.id);

    // 5. Delete affiliate data if user is an affiliate
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (affiliate) {
      await admin.from("affiliate_payouts").delete().eq("affiliate_id", affiliate.id);
      await admin.from("affiliate_conversions").delete().eq("affiliate_id", affiliate.id);
      await admin.from("affiliate_clicks").delete().eq("affiliate_id", affiliate.id);
      await admin.from("affiliates").delete().eq("id", affiliate.id);
    }

    // 6. Clean up referral records where user is referrer
    await admin.from("user_referrals").delete().eq("referrer_id", user.id);

    // 7. Nullify referral records where user was referred (preserve referrer's data)
    await admin
      .from("user_referrals")
      .update({ referred_user_id: null })
      .eq("referred_user_id", user.id);

    // 8. Nullify affiliate conversions where user was the referred user
    await admin
      .from("affiliate_conversions")
      .update({ referred_user_id: null })
      .eq("referred_user_id", user.id);

    // 9. Delete remaining user data
    await admin.from("user_usage").delete().eq("user_id", user.id);
    await admin.from("api_keys").delete().eq("user_id", user.id);
    await admin.from("subscriptions").delete().eq("user_id", user.id);
    await admin.from("notification_log").delete().eq("user_id", user.id);

    // 10. Delete the auth user
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
