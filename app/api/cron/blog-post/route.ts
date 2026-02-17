import { verifyCronSecret } from "@/lib/cron-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateText } from "@/lib/ai/client";
import { generateBlogBanner, generateInlineImage } from "@/lib/blog-images";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const BLOG_SYSTEM_PROMPT = `Si strokovni avtor za blog platforme 1984 (1984.si) — slovensko AI platformo za ustvarjanje vsebin.

Piši izključno v slovenščini. Tvoji članki morajo biti:
- SEO optimizirani z naravno vključenimi ključnimi besedami
- Dolgi 800-1200 besed
- Strukturirani z naslovi (## za h2, ### za h3)
- Napisani v profesionalnem a dostopnem tonu
- Vključujoč 1-2 interni povezavi do funkcij platforme 1984 (npr. [AI Besedila](/funkcije/ai-besedila))
- Zaključeni s pozivom k dejanju (CTA) za preizkus platforme 1984

Odgovori v JSON formatu:
{
  "title": "Naslov članka",
  "slug": "url-slug-brez-sumnikov",
  "excerpt": "Kratek opis za kartico (1-2 stavka)",
  "content": "Celoten članek v markdown formatu",
  "meta_title": "SEO naslov | 1984 Blog",
  "meta_description": "Meta opis za Google (do 160 znakov)",
  "read_min": 5,
  "inline_image_prompts": ["English prompt for inline image 1"]
}

Za inline slike vstavi placeholder INLINE_IMAGE_0, INLINE_IMAGE_1, itd. v content na mestih, kjer naj bo slika. Uporabi največ 1 inline sliko.`;

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Find next pending topic
  const today = new Date().toISOString().split("T")[0];
  const { data: topic, error: topicError } = await admin
    .from("blog_topics")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_date", today)
    .order("day_number", { ascending: true })
    .limit(1)
    .single();

  if (topicError || !topic) {
    return NextResponse.json({ message: "No pending topics" });
  }

  try {
    // Generate blog post with Claude
    const userPrompt = `Napiši blog članek na temo: ${topic.title_hint}\n\nPodrobna navodila: ${topic.topic}\n\nKategorija: ${topic.category}\nKljučne besede: ${topic.keywords.join(", ")}`;

    const rawResponse = await generateText({
      systemPrompt: BLOG_SYSTEM_PROMPT,
      userPrompt,
      tier: "free", // Sonnet for blog generation
      maxTokens: 4096,
    });

    // Parse JSON from response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse JSON from response");

    const postData = JSON.parse(jsonMatch[0]) as {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      meta_title: string;
      meta_description: string;
      read_min: number;
      inline_image_prompts?: string[];
    };

    // Generate banner image
    let bannerUrl: string | null = null;
    let bannerPath: string | null = null;
    try {
      const banner = await generateBlogBanner(
        postData.slug,
        topic.image_prompt
      );
      bannerUrl = banner.url;
      bannerPath = banner.storagePath;
    } catch (imgErr) {
      console.error("Banner generation failed:", imgErr);
    }

    // Generate inline images and replace placeholders
    let content = postData.content;
    const inlineImages: { url: string; alt: string }[] = [];

    if (postData.inline_image_prompts?.length) {
      for (let i = 0; i < postData.inline_image_prompts.length; i++) {
        try {
          const inline = await generateInlineImage(
            postData.slug,
            i,
            postData.inline_image_prompts[i]
          );
          inlineImages.push({
            url: inline.url,
            alt: postData.inline_image_prompts[i],
          });
          content = content.replace(
            `INLINE_IMAGE_${i}`,
            `![${postData.inline_image_prompts[i]}](${inline.url})`
          );
        } catch (imgErr) {
          console.error(`Inline image ${i} failed:`, imgErr);
          content = content.replace(`INLINE_IMAGE_${i}`, "");
        }
      }
    }

    // Insert blog post
    const { data: newPost, error: insertError } = await admin
      .from("blog_posts")
      .insert({
        slug: postData.slug,
        title: postData.title,
        excerpt: postData.excerpt,
        content,
        category: topic.category,
        banner_image_url: bannerUrl,
        banner_image_storage_path: bannerPath,
        inline_images: inlineImages,
        meta_title: postData.meta_title,
        meta_description: postData.meta_description,
        keywords: topic.keywords,
        read_min: postData.read_min || 5,
        status: "published",
        publish_at: new Date().toISOString(),
        source: "generated",
        generation_topic_id: topic.id,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Update topic status
    await admin
      .from("blog_topics")
      .update({
        status: "generated",
        generated_post_id: newPost.id,
      })
      .eq("id", topic.id);

    return NextResponse.json({
      message: "Post generated",
      slug: postData.slug,
      title: postData.title,
      topicId: topic.id,
    });
  } catch (err) {
    console.error("Blog generation failed:", err);

    // Mark topic as failed
    await admin
      .from("blog_topics")
      .update({ status: "failed" })
      .eq("id", topic.id);

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
