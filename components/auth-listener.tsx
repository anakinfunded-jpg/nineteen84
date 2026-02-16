"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Listens for Supabase auth state changes (e.g. OAuth tokens in URL hash).
 * If a user signs in while on a public page, redirects to /dashboard
 * or to the ?redirect= param if present.
 */
export function AuthListener() {
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Redirect on sign-in or when tokens arrive via hash (implicit flow fallback)
      if (
        (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
        session &&
        !redirected.current
      ) {
        // Only redirect if on a public/auth page, not already inside the app
        const isAppPage =
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/ai-") ||
          pathname.startsWith("/narocnina") ||
          pathname.startsWith("/partnerji") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/pretvorniki");

        if (!isAppPage) {
          redirected.current = true;
          // Check for redirect param in URL
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect");
          const destination = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
            ? redirect
            : "/dashboard";
          // Full page navigation ensures auth cookies are sent with the request
          window.location.href = destination;
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  return null;
}
