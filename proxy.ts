import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Marketing / public pages — NO auth check needed (fast path)
const publicPaths = new Set([
  "/",
  "/prijava",
  "/registracija",
  "/cenik",
  "/blog",
  "/o-nas",
  "/kontakt",
  "/pogoji",
  "/zasebnost",
  "/funkcije",
  "/affiliate",
]);

function isPublicPath(pathname: string) {
  if (publicPaths.has(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/funkcije/")) return true;
  if (pathname.startsWith("/blog/")) return true;
  return false;
}

function isAuthPage(pathname: string) {
  return pathname === "/prijava" || pathname === "/registracija";
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ── Affiliate referral tracking ──
  // If ?ref=CODE is present, set a 90-day cookie and redirect to clean URL
  const refCode = searchParams.get("ref");
  if (refCode && /^[a-z0-9-]+$/i.test(refCode)) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("ref");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set("__1984_ref", refCode.toLowerCase(), {
      maxAge: 90 * 24 * 60 * 60, // 90 days
      path: "/",
      sameSite: "lax",
      httpOnly: false, // needs to be readable by frontend for checkout
    });
    return response;
  }

  // ── Fast path: public pages skip Supabase entirely ──
  // This avoids the ~200-400ms auth.getUser() round-trip for every visitor
  if (isPublicPath(pathname) && !isAuthPage(pathname)) {
    return NextResponse.next();
  }

  // ── Auth-required pages: check session ──
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/prijava";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/register pages
  if (user && isAuthPage(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
