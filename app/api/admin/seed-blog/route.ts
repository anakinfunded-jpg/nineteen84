import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBlogBanner } from "@/lib/blog-images";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["anakinfunded@gmail.com"];

export const maxDuration = 300; // 5 min for generating many images

export async function POST(request: NextRequest) {
  // Admin auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { action } = (await request.json()) as {
    action: "seed-posts" | "seed-topics";
  };

  const admin = createAdminClient();

  if (action === "seed-posts") {
    const { curatedPosts } = await import("@/lib/blog/curated-posts");
    const { curatedPosts2 } = await import("@/lib/blog/curated-posts-2");
    const allPosts = [...curatedPosts, ...curatedPosts2];

    const results: { slug: string; status: string; error?: string }[] = [];

    for (const post of allPosts) {
      try {
        // Check if already seeded
        const { data: existing } = await admin
          .from("blog_posts")
          .select("id")
          .eq("slug", post.slug)
          .single();

        if (existing) {
          results.push({ slug: post.slug, status: "skipped" });
          continue;
        }

        // Generate banner image
        let bannerUrl: string | null = null;
        let bannerPath: string | null = null;
        try {
          const banner = await generateBlogBanner(post.slug, post.image_prompt);
          bannerUrl = banner.url;
          bannerPath = banner.storagePath;
        } catch (imgErr) {
          console.error(`Image failed for ${post.slug}:`, imgErr);
        }

        // Insert post
        const { error: insertError } = await admin.from("blog_posts").insert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          banner_image_url: bannerUrl,
          banner_image_storage_path: bannerPath,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          keywords: post.keywords,
          read_min: post.read_min,
          status: "published",
          publish_at: post.publish_at,
          source: "curated",
        });

        if (insertError) throw insertError;
        results.push({ slug: post.slug, status: "created" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        results.push({ slug: post.slug, status: "error", error: msg });
      }
    }

    return NextResponse.json({ results });
  }

  if (action === "seed-topics") {
    const { scheduledTopics } = await import("@/lib/blog/scheduled-topics");

    // Calculate scheduled dates starting from tomorrow
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    const rows = scheduledTopics.map((topic, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        id: topic.id,
        day_number: topic.day_number,
        title_hint: topic.title_hint,
        topic: topic.topic,
        category: topic.category,
        keywords: topic.keywords,
        image_prompt: topic.image_prompt,
        status: "pending",
        scheduled_date: date.toISOString().split("T")[0],
      };
    });

    const { error } = await admin
      .from("blog_topics")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Seeded ${rows.length} topics`,
      firstDate: rows[0].scheduled_date,
      lastDate: rows[rows.length - 1].scheduled_date,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
