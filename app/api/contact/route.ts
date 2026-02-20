import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { authLimit, rateLimitResponse } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP to prevent spam
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const { success, reset } = await authLimit.limit(ip);
    if (!success) return rateLimitResponse(reset);

    const { name, email, message } = (await request.json()) as {
      name: string;
      email: string;
      message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Vsa polja so obvezna" },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Neveljaven e-poštni naslov" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "1984 Kontakt <info@1984.si>",
      to: "info@1984.si",
      replyTo: email,
      subject: `Kontaktni obrazec: ${name}`,
      text: `Ime: ${name}\nE-pošta: ${email}\n\nSporočilo:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Napaka pri pošiljanju sporočila" },
      { status: 500 }
    );
  }
}
