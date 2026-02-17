import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";

const openai = new OpenAI();

const BUCKET = "blog-images";

async function generateAndUpload(
  prompt: string,
  storagePath: string,
  size: "1536x1024" | "1024x1024"
): Promise<{ url: string; storagePath: string }> {
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size,
    quality: "medium",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data returned");

  const buffer = Buffer.from(b64, "base64");
  const admin = createAdminClient();

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: "image/png",
      cacheControl: "31536000",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = admin.storage.from(BUCKET).getPublicUrl(storagePath);

  return { url: publicUrl, storagePath };
}

export async function generateBlogBanner(
  slug: string,
  prompt: string
): Promise<{ url: string; storagePath: string }> {
  return generateAndUpload(
    prompt,
    `banners/${slug}.png`,
    "1536x1024"
  );
}

export async function generateInlineImage(
  slug: string,
  index: number,
  prompt: string
): Promise<{ url: string; storagePath: string }> {
  return generateAndUpload(
    prompt,
    `inline/${slug}/${index}.png`,
    "1024x1024"
  );
}
