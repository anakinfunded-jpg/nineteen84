import { createAdminClient } from "@/lib/supabase/admin";
import { publicLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await publicLimit.limit(ip);
  if (!success) {
    return new Response("Preveč zahtevkov.", { status: 429 });
  }

  const token = request.nextUrl.searchParams.get("token");

  if (token) {
    const supabase = createAdminClient();
    await supabase
      .from("outreach_contacts")
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", token);
  }

  const html = `<!DOCTYPE html>
<html lang="sl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Odjava — 1984</title>
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:#171717; font-family:'Helvetica Neue',Arial,sans-serif; color:#E1E1E1; }
    .card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
      border-radius:16px; padding:48px; max-width:420px; text-align:center; }
    h1 { font-size:28px; margin:0 0 8px; background:linear-gradient(90deg,#EFBC9F,#D797A6,#FF9ED1);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    p { color:#E1E1E1; opacity:0.6; line-height:1.6; margin:16px 0 0; font-size:15px; }
    .check { font-size:48px; margin-bottom:16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">&#10003;</div>
    <h1>1984</h1>
    <p>Uspešno ste se odjavili od naših sporočil. Ne boste več prejemali e-pošte od nas.</p>
    <p style="margin-top:24px;opacity:0.3;font-size:13px">Če ste se odjavili pomotoma, nas kontaktirajte na info@1984.si</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
