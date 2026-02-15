"use client";

import { useEffect } from "react";

/**
 * Tracks affiliate referral clicks.
 * When a user visits with ?ref=CODE, the middleware sets a cookie and redirects.
 * This component fires the click tracking API call after the redirect.
 */
export function ReferralTracker() {
  useEffect(() => {
    // Read the ref cookie (set by middleware on redirect)
    const match = document.cookie.match(/(?:^|; )__1984_ref=([^;]*)/);
    const code = match?.[1];
    if (!code) return;

    // Only fire click once per session
    const sessionKey = `__1984_click_${code}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    // Record the click
    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => {
      // Silent fail — click tracking is non-critical
    });
  }, []);

  return null;
}
