import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getOutreachTemplate, renderSubject } from "@/lib/email/templates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://1984.si";

  // Find campaigns that are scheduled and due
  const { data: campaigns } = await supabase
    .from("outreach_campaigns")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString());

  if (!campaigns || campaigns.length === 0) {
    return Response.json({ message: "Ni kampanj za pošiljanje", sent: 0 });
  }

  let totalSent = 0;

  for (const campaign of campaigns) {
    const template = getOutreachTemplate(campaign.template_id);
    if (!template) continue;

    // Mark campaign as sending
    await supabase
      .from("outreach_campaigns")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", campaign.id);

    // Get eligible contacts (not unsubscribed, not already sent this campaign)
    let contactQuery = supabase
      .from("outreach_contacts")
      .select("id, email, name, company")
      .eq("unsubscribed", false);

    // Apply tag filter if set
    if (campaign.tag_filter && campaign.tag_filter.length > 0) {
      contactQuery = contactQuery.overlaps("tags", campaign.tag_filter);
    }

    const { data: contacts } = await contactQuery;
    if (!contacts || contacts.length === 0) {
      await supabase
        .from("outreach_campaigns")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", campaign.id);
      continue;
    }

    // Filter out contacts who already received this campaign
    const { data: existingSends } = await supabase
      .from("outreach_sends")
      .select("contact_id")
      .eq("campaign_id", campaign.id);

    const sentContactIds = new Set(
      (existingSends || []).map((s) => s.contact_id)
    );
    const eligibleContacts = contacts.filter((c) => !sentContactIds.has(c.id));

    for (const contact of eligibleContacts) {
      // Create send record first
      const { data: send } = await supabase
        .from("outreach_sends")
        .insert({
          campaign_id: campaign.id,
          contact_id: contact.id,
          status: "pending",
        })
        .select("id")
        .single();

      if (!send) continue;

      const subject = renderSubject(campaign.subject || template.subject, {
        name: contact.name,
        company: contact.company,
      });

      const html = template.body({
        name: contact.name,
        company: contact.company,
        sendId: send.id,
        contactId: contact.id,
        appUrl,
      });

      try {
        const result = await sendEmail({
          to: contact.email,
          subject,
          html,
          contactId: contact.id,
        });

        await supabase
          .from("outreach_sends")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            resend_id: result?.id || null,
          })
          .eq("id", send.id);

        totalSent++;
      } catch {
        await supabase
          .from("outreach_sends")
          .update({ status: "failed" })
          .eq("id", send.id);
      }

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200));
    }

    // Mark campaign as sent
    await supabase
      .from("outreach_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
  }

  return Response.json({
    message: `Poslano ${totalSent} sporočil`,
    sent: totalSent,
  });
}
