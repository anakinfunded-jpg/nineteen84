import { validateApiKey, apiErrorResponse } from "@/lib/api/auth";
import { checkOcrLimit, incrementOcr, countWords, incrementWords } from "@/lib/credits";
import { apiLimit } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

const MODELS = {
  premium: "claude-opus-4-6",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  ocr: "Si OCR sistem. Natančno izvleci VSE besedilo iz slike. Ohrani formatiranje (odstavke, sezname, tabele). Vrni samo izvlečeno besedilo brez komentarjev.",
  describe: "Si vizualni asistent. Natančno opiši sliko v slovenščini. Piši v brezhibni slovenščini. Vključi podrobnosti o vsebini, barvah, kompoziciji in razpoloženju slike.",
};

export async function POST(request: Request) {
  try {
    const apiUser = await validateApiKey(request);

    const { success } = await apiLimit.limit(apiUser.userId);
    if (!success) {
      return Response.json({ success: false, error: { code: "RATE_LIMITED", message: "Preveč zahtevkov." } }, { status: 429 });
    }

    const contentType = request.headers.get("content-type") || "";
    let imageContent: Anthropic.ImageBlockParam;
    let mode = "describe";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image") as File | null;
      mode = (formData.get("mode") as string) || "describe";

      if (!image) {
        return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: image (datoteka)" } }, { status: 400 });
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const mediaType = (image.type || "image/png") as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

      imageContent = {
        type: "image",
        source: { type: "base64", media_type: mediaType, data: buffer.toString("base64") },
      };
    } else {
      const body = await request.json();
      mode = body.mode || "describe";

      if (!body.imageUrl) {
        return Response.json({ success: false, error: { code: "MISSING_FIELDS", message: "Obvezno polje: imageUrl ali image (FormData)" } }, { status: 400 });
      }

      imageContent = {
        type: "image",
        source: { type: "url", url: body.imageUrl },
      };
    }

    if (!SYSTEM_PROMPTS[mode]) {
      return Response.json({ success: false, error: { code: "INVALID_MODE", message: "Veljavna načina: ocr, describe" } }, { status: 400 });
    }

    const withinLimit = await checkOcrLimit(apiUser.userId);
    if (!withinLimit) {
      return Response.json({ success: false, error: { code: "LIMIT_EXCEEDED", message: "Mesečna omejitev OCR dosežena." } }, { status: 403 });
    }

    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODELS.premium,
      max_tokens: 4096,
      system: SYSTEM_PROMPTS[mode],
      messages: [
        {
          role: "user",
          content: [
            imageContent,
            { type: "text", text: mode === "ocr" ? "Izvleci vse besedilo iz te slike." : "Opiši to sliko podrobno v slovenščini." },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.text ?? "";

    await incrementOcr(apiUser.userId);
    const words = countWords(text);
    if (words > 0) await incrementWords(apiUser.userId, words);

    return Response.json({
      success: true,
      data: { text, mode, words },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
