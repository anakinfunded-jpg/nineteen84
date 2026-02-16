"use client";

import { AuthListener } from "@/components/auth-listener";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function PrijavaPage() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("napaka");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError ? `OAuth napaka: ${authError}` : "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
        setError("Napačen e-poštni naslov ali geslo.");
      } else if (msg.includes("email not confirmed")) {
        setError("E-poštni naslov še ni potrjen. Preverite svojo e-pošto.");
      } else if (msg.includes("rate limit")) {
        setError("Preveč poskusov. Počakajte nekaj minut.");
      } else {
        setError(`Prijava ni uspela: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    // Full page navigation ensures auth cookies are sent with the request
    window.location.href = "/dashboard";
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const supabase = createClient();
    // Always use actual origin to match cookies/PKCE verifier domain
    const redirectBase = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectBase}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-6">
      <AuthListener />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="text-4xl font-serif tracking-[0.01em] logo-gradient inline-block"
          >
            1984
          </Link>
          <p className="mt-3 text-[#E1E1E1]/50 text-sm">
            Prijava v vaš račun
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.06] border border-white/[0.06] text-[#E1E1E1] text-sm font-medium hover:bg-white/[0.1] transition-colors duration-200 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Nadaljuj z Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-[#E1E1E1]/30 uppercase tracking-wider">
              ali
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#E1E1E1]/60 mb-1.5"
              >
                E-poštni naslov
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
                placeholder="ime@podjetje.si"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#E1E1E1]/60 mb-1.5"
              >
                Geslo
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400/90">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Prijava
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#E1E1E1]/40">
          Nimate računa?{" "}
          <Link
            href="/registracija"
            className="text-[#FEB089] hover:text-[#FFB288] transition-colors duration-200"
          >
            Registrirajte se
          </Link>
        </p>
      </div>
    </div>
  );
}
