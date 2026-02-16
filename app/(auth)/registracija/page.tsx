"use client";

import { AuthListener } from "@/components/auth-listener";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200";
const selectCls =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 appearance-none transition-colors duration-200";

function RegistracijaForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const isAffiliate = redirect === "/partnerji";

  // Account fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Affiliate fields
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [niche, setNiche] = useState("");
  const [promoPlan, setPromoPlan] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function saveAffiliateData() {
    const data = {
      code: code.toLowerCase().trim(),
      full_name: fullName.trim() || undefined,
      phone: phone.trim() || undefined,
      instagram: instagram.trim() || undefined,
      tiktok: tiktok.trim() || undefined,
      youtube: youtube.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      website: website.trim() || undefined,
      audience_size: audienceSize || undefined,
      niche: niche || undefined,
      promo_plan: promoPlan.trim() || undefined,
    };
    localStorage.setItem("pending_affiliate", JSON.stringify(data));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Geslo mora imeti vsaj 6 znakov.");
      setLoading(false);
      return;
    }

    if (isAffiliate) {
      if (!code || code.trim().length < 3) {
        setError("Partnerska koda mora imeti vsaj 3 znake.");
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9-]+$/.test(code)) {
        setError("Koda lahko vsebuje samo črke, številke in vezaje.");
        setLoading(false);
        return;
      }
      if (!audienceSize) {
        setError("Izberite velikost vaše publike.");
        setLoading(false);
        return;
      }
      if (!niche) {
        setError("Izberite nišo / področje.");
        setLoading(false);
        return;
      }
      if (!promoPlan.trim()) {
        setError("Opišite, kako bi promovirali 1984.");
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();
    const callbackUrl = redirect
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: callbackUrl,
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("Ta e-poštni naslov je že registriran. Poskusite se prijaviti.");
      } else if (msg.includes("rate limit")) {
        setError("Preveč poskusov. Počakajte nekaj minut in poskusite znova.");
      } else if (msg.includes("password")) {
        setError("Geslo ne ustreza zahtevam. Uporabite vsaj 6 znakov.");
      } else {
        setError(`Registracija ni uspela: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    // Save affiliate data to localStorage for auto-submit after email confirmation
    if (isAffiliate) {
      saveAffiliateData();
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    // Save affiliate data before redirect (Google OAuth leaves the page)
    if (isAffiliate && code.trim().length >= 3) {
      saveAffiliateData();
    }
    setGoogleLoading(true);
    const supabase = createClient();
    const redirectBase = window.location.origin;
    const callbackUrl = redirect
      ? `${redirectBase}/auth/callback?next=${encodeURIComponent(redirect)}`
      : `${redirectBase}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <Link
          href="/"
          className="text-4xl font-serif tracking-[0.01em] logo-gradient inline-block"
        >
          1984
        </Link>
        <div className="glass-card rounded-2xl p-8 mt-10">
          <h2 className="text-xl font-semibold text-white">
            Preverite svojo e-pošto
          </h2>
          <p className="mt-3 text-sm text-[#E1E1E1]/60 leading-relaxed">
            Na <span className="text-[#FEB089]">{email}</span> smo poslali
            potrditveno povezavo. Kliknite nanjo, da aktivirate svoj račun.
          </p>
          {isAffiliate && (
            <p className="mt-3 text-sm text-[#FEB089]/80">
              Po potrditvi bo vaša partnerska prijava samodejno poslana.
            </p>
          )}
        </div>
        <p className="mt-6 text-sm text-[#E1E1E1]/40">
          <Link
            href={redirect ? `/prijava?redirect=${encodeURIComponent(redirect)}` : "/prijava"}
            className="text-[#FEB089] hover:text-[#FFB288] transition-colors duration-200"
          >
            Nazaj na prijavo
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={isAffiliate ? "w-full max-w-2xl" : "w-full max-w-md"}>
      {/* Logo */}
      <div className="text-center mb-10">
        <Link
          href="/"
          className="text-4xl font-serif tracking-[0.01em] logo-gradient inline-block"
        >
          1984
        </Link>
        {isAffiliate ? (
          <>
            <p className="mt-3 text-[#E1E1E1]/50 text-sm">
              Partnerski program
            </p>
            <p className="mt-2 text-xs text-[#FEB089]/70">
              Ustvarite račun in se prijavite kot partner — zaslužite 30% provizije
            </p>
          </>
        ) : (
          <p className="mt-3 text-[#E1E1E1]/50 text-sm">
            Ustvarite svoj račun
          </p>
        )}
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

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Account section */}
          {isAffiliate && (
            <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold">
              Račun
            </p>
          )}

          <div className={isAffiliate ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
            <div>
              <label htmlFor="fullName" className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Ime in priimek <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={inputCls}
                placeholder="Janez Novak"
              />
            </div>

            {isAffiliate && (
              <div>
                <label htmlFor="phone" className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                  Telefonska številka
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                  placeholder="+386 40 123 456"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                E-poštni naslov <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
                placeholder="ime@podjetje.si"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Geslo <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputCls}
                placeholder="Vsaj 6 znakov"
              />
            </div>
          </div>

          {/* Affiliate fields */}
          {isAffiliate && (
            <>
              {/* Online presence */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-1">
                  Vaša prisotnost na spletu
                </p>
                <p className="text-xs text-[#E1E1E1]/30 mb-4">
                  Izpolnite vsaj en profil. Priporočamo min. 1.000 sledilcev.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">Instagram</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@uporabnik"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">TikTok</label>
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="@uporabnik"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">YouTube</label>
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="URL kanala"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">LinkedIn</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="URL profila"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">Spletna stran / Blog</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Audience info */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-4">
                  O vaši publiki
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      Velikost publike <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={audienceSize}
                      onChange={(e) => setAudienceSize(e.target.value)}
                      className={selectCls}
                    >
                      <option value="" className="bg-[#191919]">Izberite</option>
                      <option value="1000-5000" className="bg-[#191919]">1.000 – 5.000 sledilcev</option>
                      <option value="5000-20000" className="bg-[#191919]">5.000 – 20.000 sledilcev</option>
                      <option value="20000-50000" className="bg-[#191919]">20.000 – 50.000 sledilcev</option>
                      <option value="50000+" className="bg-[#191919]">50.000+ sledilcev</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      Niša / področje <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className={selectCls}
                    >
                      <option value="" className="bg-[#191919]">Izberite</option>
                      <option value="marketing" className="bg-[#191919]">Marketing</option>
                      <option value="podjetnistvo" className="bg-[#191919]">Podjetništvo</option>
                      <option value="tehnologija" className="bg-[#191919]">Tehnologija</option>
                      <option value="oblikovanje" className="bg-[#191919]">Oblikovanje</option>
                      <option value="e-trgovina" className="bg-[#191919]">E-trgovina</option>
                      <option value="izobrazevanje" className="bg-[#191919]">Izobraževanje</option>
                      <option value="drugo" className="bg-[#191919]">Drugo</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      Kako bi promovirali 1984? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={promoPlan}
                      onChange={(e) => setPromoPlan(e.target.value)}
                      rows={3}
                      placeholder="Npr. Instagram stories, video recenzije, blog objave, newsletter..."
                      className={inputCls + " resize-none"}
                    />
                  </div>
                </div>
              </div>

              {/* Referral code */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-4">
                  Vaša koda
                </p>
                <div>
                  <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                    Partnerska koda <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#E1E1E1]/30 shrink-0">1984.si/?ref=</span>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                      required
                      minLength={3}
                      maxLength={30}
                      placeholder="vasa-koda"
                      className={"flex-1 " + inputCls}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#E1E1E1]/30">
                    Samo male črke, številke in vezaji. Min. 3 znaki.
                  </p>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-400/90">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isAffiliate ? "Ustvari račun in pošlji prijavo" : "Ustvari račun"}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-[#E1E1E1]/40">
        Že imate račun?{" "}
        <Link
          href={redirect ? `/prijava?redirect=${encodeURIComponent(redirect)}` : "/prijava"}
          className="text-[#FEB089] hover:text-[#FFB288] transition-colors duration-200"
        >
          Prijavite se
        </Link>
      </p>
    </div>
  );
}

export default function RegistracijaPage() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-6 py-12">
      <AuthListener />
      <Suspense>
        <RegistracijaForm />
      </Suspense>
    </div>
  );
}
