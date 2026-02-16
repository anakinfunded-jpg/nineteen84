import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInpaintingLimit, incrementInpainting, incrementImages } from "@/lib/credits";
import OpenAI, { toFile } from "openai";
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
    // Convert Web File to Buffer for SDK compatibility
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer());
    const uploadableImage = await toFile(imageBuffer, "image.png", { type: "image/png" });
    const uploadableMask = await toFile(maskBuffer, "mask.png", { type: "image/png" });

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: uploadableImage,
      mask: uploadableMask,
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      return NextResponse.json(
        { error: "Napaka pri urejanju slike" },
        { status: 500 }
      );
    }

    // Upload to Supabase Storage
    const buffer = Buffer.from(imageData.b64_json, "base64");
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
