import { getAffiliateByCode, recordClick } from "@/lib/affiliate";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const affiliate = await getAffiliateByCode(code);
  if (!affiliate || affiliate.status !== "active") {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  // Hash IP for dedup (privacy-friendly)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = crypto.createHash("sha256").update(ip + code).digest("hex").slice(0, 16);
  const userAgent = request.headers.get("user-agent") || null;
  const referrer = request.headers.get("referer") || null;

  await recordClick(affiliate.id, ipHash, userAgent, referrer);

  return NextResponse.json({ ok: true });
}
