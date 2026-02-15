"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-[#E1E1E1]/80">
            Uporabljamo piškotke za delovanje spletne strani in izboljšanje
            uporabniške izkušnje.{" "}
            <Link
              href="/zasebnost"
              className="text-[#FEB089] hover:underline"
            >
              Politika zasebnosti
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-sm text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors duration-200"
          >
            Zavrni
          </button>
          <button
            onClick={accept}
            className="cta-button px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Sprejmi
          </button>
        </div>
      </div>
    </div>
  );
}
