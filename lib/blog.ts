import { createAdminClient } from "@/lib/supabase/admin";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  banner_image_url: string | null;
  inline_images: { url: string; alt: string }[];
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  read_min: number;
  publish_at: string;
  source: "curated" | "generated";
};

type BlogPostListItem = Pick<
  BlogPost,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "banner_image_url"
  | "read_min"
  | "publish_at"
>;

export async function getPublishedPosts(): Promise<BlogPostListItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, banner_image_url, read_min, publish_at"
    )
    .eq("status", "published")
    .lte("publish_at", new Date().toISOString())
    .order("publish_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, content, category, banner_image_url, inline_images, meta_title, meta_description, keywords, read_min, publish_at, source"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .lte("publish_at", new Date().toISOString())
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function getAllPublishedSlugs(): Promise<
  { slug: string; publish_at: string }[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, publish_at")
    .eq("status", "published")
    .lte("publish_at", new Date().toISOString());

  if (error) {
    console.error("getAllPublishedSlugs error:", error.message);
    return [];
  }
  return data ?? [];
}
