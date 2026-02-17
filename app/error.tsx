"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">!</span>
        </div>
        <h2 className="text-xl font-semibold text-white">
          Prišlo je do napake
        </h2>
        <p className="mt-2 text-sm text-[#E1E1E1]/50">
          Nekaj je šlo narobe. Prosimo, poskusite znova.
        </p>
        <button
          onClick={reset}
          className="mt-6 cta-button px-8 py-3 rounded-xl font-semibold text-sm"
        >
          Poskusite znova
        </button>
      </div>
    </div>
  );
}
