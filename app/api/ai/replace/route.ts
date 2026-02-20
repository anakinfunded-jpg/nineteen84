import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInpaintingLimit, incrementInpainting, incrementImages } from "@/lib/credits";
import { aiImageLimit, rateLimitResponse } from "@/lib/rate-limit";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
  }

  const { success, reset } = await aiImageLimit.limit(user.id);
  if (!success) return rateLimitResponse(reset);

  const withinLimit = await checkInpaintingLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste mesečno omejitev urejanja slik. Nadgradite paket za več." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const imageFile = formData.get("image") as File | null;
  const findText = formData.get("find") as string | null;
  const replaceText = formData.get("replace") as string | null;

  if (imageFile && imageFile.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Slika je prevelika. Največja velikost je 10 MB." },
      { status: 400 }
    );
  }

  if (!imageFile || !findText?.trim() || !replaceText?.trim()) {
    return NextResponse.json(
      { error: "Slika, opis iskanja in opis zamenjave so obvezni" },
      { status: 400 }
    );
  }

  try {
    // Validate image MIME type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const mimeType = imageFile.type || "image/png";
    if (!allowedImageTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Nepodprt format slike. Dovoljeni: JPEG, PNG, GIF, WebP." },
        { status: 400 }
      );
    }

    // Convert file to base64 for Responses API
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    // Use Responses API with image_generation tool (gpt-image-1 via GPT-4o)
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image" as const,
              image_url: `data:${mimeType};base64,${base64Image}`,
              detail: "auto" as const,
            },
            {
              type: "input_text" as const,
              text: `Edit this image: find "${findText}" and replace it with "${replaceText}". Keep everything else in the image exactly the same. Preserve all details, text, and other elements.`,
            },
          ],
        },
      ],
      tools: [
        {
          type: "image_generation",
          action: "edit",
          input_fidelity: "high",
          quality: "high",
          size: "auto",
          output_format: "png",
        },
      ],
    });

    // Extract the edited image from response
    const imageCall = response.output.find(
      (item) => item.type === "image_generation_call"
    );

    if (
      !imageCall ||
      imageCall.type !== "image_generation_call" ||
      !imageCall.result
    ) {
      return NextResponse.json(
        { error: "Napaka pri urejanju slike" },
        { status: 500 }
      );
    }

    // Upload to Supabase Storage
    const buffer = Buffer.from(imageCall.result, "base64");
    const fileName = `${user.id}/replace-${Date.now()}.png`;

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

    const {
      data: { publicUrl },
    } = admin.storage.from("generated-images").getPublicUrl(fileName);

    await incrementInpainting(user.id);
    await incrementImages(user.id);

    return NextResponse.json({ image_url: publicUrl });
  } catch (err) {
    console.error("[ai/replace] error:", err);
    return NextResponse.json({ error: "Napaka pri urejanju slike" }, { status: 500 });
  }
}
