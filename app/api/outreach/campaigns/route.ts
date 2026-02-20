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

  // Get campaigns with send stats
  const { data: campaigns, error } = await admin
    .from("outreach_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get stats for each campaign
  const enriched = await Promise.all(
    (campaigns || []).map(async (c) => {
      const { count: totalSends } = await admin
        .from("outreach_sends")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", c.id);

      const { count: sentCount } = await admin
        .from("outreach_sends")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", c.id)
        .eq("status", "sent");

      const { count: openedCount } = await admin
        .from("outreach_sends")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", c.id)
        .not("opened_at", "is", null);

      const { count: clickedCount } = await admin
        .from("outreach_sends")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", c.id)
        .not("clicked_at", "is", null);

      return {
        ...c,
        stats: {
          total: totalSends || 0,
          sent: sentCount || 0,
          opened: openedCount || 0,
          clicked: clickedCount || 0,
        },
      };
    })
  );

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, subject, templateId, scheduledAt, tagFilter } =
    (await request.json()) as {
      name: string;
      subject?: string;
      templateId: string;
      scheduledAt?: string;
      tagFilter?: string[];
    };

  if (!name || !templateId) {
    return NextResponse.json(
      { error: "Ime in predloga sta obvezna" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("outreach_campaigns")
    .insert({
      name,
      subject: subject || "",
      template_id: templateId,
      status: scheduledAt ? "scheduled" : "draft",
      scheduled_at: scheduledAt || null,
      tag_filter: tagFilter || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
