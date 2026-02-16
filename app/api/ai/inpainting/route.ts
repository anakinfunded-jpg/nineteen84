import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInpaintingLimit, incrementInpainting, incrementImages } from "@/lib/credits";
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

  const withinLimit = await checkInpaintingLimit(user.id);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Dosegli ste mesečno omejitev urejanja slik. Nadgradite paket za več." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const imageFile = formData.get("image") as File | null;
  const maskFile = formData.get("mask") as File | null;
  const prompt = formData.get("prompt") as string | null;

  if (!imageFile || !maskFile || !prompt?.trim()) {
    return NextResponse.json(
      { error: "Slika, maska in opis so obvezni" },
      { status: 400 }
    );
  }

  try {
    // Convert files to base64 for Responses API
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");
    const base64Mask = maskBuffer.toString("base64");

    // Use Responses API with image_generation tool + mask (gpt-image-1 via GPT-4o)
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image" as const,
              image_url: `data:image/png;base64,${base64Image}`,
              detail: "auto" as const,
            },
            {
              type: "input_text" as const,
              text: `Edit only the masked area of this image. In the masked region, draw: ${prompt}. Keep everything outside the mask exactly as it is.`,
            },
          ],
        },
      ],
      tools: [
        {
          type: "image_generation",
          action: "edit",
          input_fidelity: "high",
          input_image_mask: {
            image_url: `data:image/png;base64,${base64Mask}`,
          },
          quality: "high",
          size: "1024x1024",
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
    const fileName = `${user.id}/inpaint-${Date.now()}.png`;

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
    const message =
      err instanceof Error ? err.message : "Napaka pri urejanju slike";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
