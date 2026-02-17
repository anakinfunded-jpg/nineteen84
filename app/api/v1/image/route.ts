import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { checkImageLimit, incrementImages, getUsage, getUserPlan } from "@/lib/credits";
import { PLANS } from "@/lib/stripe";
import { apiLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import OpenAI from "openai";

const openai = new OpenAI();

type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
type ImageQuality = "low" | "medium" | "high";

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const { prompt, size = "1024x1024", quality = "medium" } = await request.json();

    if (!prompt) {
      return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: prompt" } }, { status: 400 });
    }

    const validSizes: ImageSize[] = ["1024x1024", "1024x1536", "1536x1024"];
    const validQualities: ImageQuality[] = ["low", "medium", "high"];

    const mappedSize: ImageSize = validSizes.includes(size) ? size : "1024x1024";
    const mappedQuality: ImageQuality = validQualities.includes(quality) ? quality : "medium";

    const withinLimit = await checkImageLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev slik dosežena." } }, { status: 403 });
    }

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: mappedSize,
      quality: mappedQuality,
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      return Response.json({ success: false, error: { code: "GENERATION_FAILED", message: "Napaka pri generiranju slike." } }, { status: 500 });
    }

    const buffer = Buffer.from(imageData.b64_json, "base64");
    const fileName = `${apiUser.userId}/${Date.now()}.png`;
    const admin = createAdminClient();

    await admin.storage.from("generated-images").upload(fileName, buffer, { contentType: "image/png" });
    const { data: urlData } = admin.storage.from("generated-images").getPublicUrl(fileName);

    const { data: imageRecord } = await admin
      .from("generated_images")
      .insert({ user_id: apiUser.userId, prompt, image_url: urlData.publicUrl, size: mappedSize, quality: mappedQuality })
      .select("id, prompt, image_url, size, quality, created_at")
      .single();

    await incrementImages(apiUser.userId);

    const usage = await getUsage(apiUser.userId);
    const plan = PLANS[await getUserPlan(apiUser.userId)];

    return Response.json({
      success: true,
      data: imageRecord,
      usage: { images_used: usage.imagesUsed, images_limit: plan.images },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
