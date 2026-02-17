import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

function sanitizeRedirect(path: string | null): string {
  if (!path) return "/dashboard";
  // Only allow relative paths starting with / (not // which is protocol-relative)
  if (!path.startsWith("/") || path.startsWith("//")) return "/dashboard";
  // Block any URL with a host component
  try {
    const url = new URL(path, "http://dummy");
    if (url.hostname !== "dummy") return "/dashboard";
  } catch {
    return "/dashboard";
  }
  return path;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirect(searchParams.get("next"));
  const baseUrl = getBaseUrl(request);

  if (code) {
    const cookieStore = await cookies();

    // Buffer cookies so we can set them on the redirect response
    const responseCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              responseCookies.push({ name, value, options });
              try {
                cookieStore.set(name, value, options);
              } catch {
                // Cookie store may be read-only — response cookies handle it
              }
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${baseUrl}${next}`);
      // Ensure auth cookies are on the redirect response
      responseCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as any);
      });
      return response;
    }
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);

    // PKCE error = email confirmed in a different browser. Account IS verified, just needs manual login.
    const isPKCE = error.message?.includes("PKCE") || error.message?.includes("code verifier");
    const errorKey = isPKCE ? "drug-brskalnik" : encodeURIComponent(error.message);
    const redirectParam = next !== "/dashboard" ? `&redirect=${encodeURIComponent(next)}` : "";
    return NextResponse.redirect(`${baseUrl}/prijava?napaka=${errorKey}${redirectParam}`);
  }

  console.error("[auth/callback] No code parameter in URL");
  return NextResponse.redirect(`${baseUrl}/prijava?napaka=no_code`);
}
