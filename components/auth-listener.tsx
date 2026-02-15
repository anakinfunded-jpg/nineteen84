"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Listens for Supabase auth state changes (e.g. OAuth tokens in URL hash).
 * If a user signs in while on a public page, redirects to /dashboard.
 */
export function AuthListener() {
  const router = useRouter();
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
          router.push("/dashboard");
          router.refresh();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  return null;
}
