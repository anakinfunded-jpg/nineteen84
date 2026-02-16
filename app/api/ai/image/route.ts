import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkImageLimit, incrementImages } from "@/lib/credits";
import { aiImageLimit, rateLimitResponse } from "@/lib/rate-limit";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI();

type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
type ImageQuality = "low" | "medium" | "high";

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { success, reset } = await aiImageLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const { prompt, size, quality } = (await request.json()) as {
    prompt: string;
    size?: string;
    quality?: string;
  };

  // Map legacy DALL-E 3 values to gpt-image-1 equivalents
  const sizeMap: Record<string, ImageSize> = {
    "1792x1024": "1536x1024",
    "1024x1792": "1024x1536",
  };
  const qualityMap: Record<string, ImageQuality> = {
    standard: "medium",
    hd: "high",
  };
  const mappedSize: ImageSize = (sizeMap[size || ""] || size || "1024x1024") as ImageSize;
  const mappedQuality: ImageQuality = (qualityMap[quality || ""] || quality || "medium") as ImageQuality;

  if (!prompt?.trim()) {
    return NextResponse.json(
      { error: "Opis slike je obvezen" },
      { status: 400 }
    );
  }

  // Check image limit
  const withinLimit = await checkImageLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste mesečno omejitev slik. Nadgradite paket za več." },
      { status: 403 }
    );
  }

  try {
    // Generate image with gpt-image-1
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: mappedSize,
      quality: mappedQuality,
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      return NextResponse.json(
        { error: "Napaka pri generiranju slike" },
        { status: 500 }
      );
    }

    const revisedPrompt = prompt;

    // Upload to Supabase Storage
    const buffer = Buffer.from(imageData.b64_json, "base64");
    const fileName = `${user.id}/${Date.now()}.png`;

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from("generated-images")
      .upload(fileName, buffer, {
        contentType: "image/png",
        cacheControl: "31536000",
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Napaka pri shranjevanju slike" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = admin.storage.from("generated-images").getPublicUrl(fileName);

    // Save metadata to database
    const { data: imageRecord, error: dbError } = await admin
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt,
        revised_prompt: revisedPrompt,
        image_url: publicUrl,
        storage_path: fileName,
        size: mappedSize,
        quality: mappedQuality,
      })
      .select("id, prompt, image_url, size, quality, created_at")
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "Napaka pri shranjevanju podatkov" },
        { status: 500 }
      );
    }

    // Track image usage
    await incrementImages(user.id);

    return NextResponse.json(imageRecord);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Napaka pri generiranju slike";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Fetch user's image history
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("generated_images")
    .select("id, prompt, image_url, size, quality, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { error: "Napaka pri nalaganju slik" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
