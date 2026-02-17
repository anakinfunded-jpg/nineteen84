"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  MousePointer,
  Users,
  TrendingUp,
  Wallet,
  Copy,
  Check,
  Link2,
  Tag,
  Trophy,
  Star,
  Crown,
  Gem,
  Medal,
  ArrowRight,
  Share2,
  Gift,
  Clock,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

type Milestone = "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";

type AffiliateStats = {
  id: string;
  code: string;
  status: string;
  commission_rate: number;
  total_clicks: number;
  total_conversions: number;
  total_earned: number;
  total_paid: number;
  milestone: Milestone;
  recentClicks: number;
  pendingPayout: number;
  recentConversions: {
    id: string;
    plan_id: string;
    amount: number;
    commission: number;
    status: string;
    created_at: string;
  }[];
  milestoneProgress: {
    current: Milestone;
    next: Milestone | null;
    nextAt: number;
    progress: number;
  };
};

type MonthlyEarning = {
  month: string;
  earnings: number;
  conversions: number;
};

const MILESTONE_META: Record<
  Milestone,
  { label: string; icon: LucideIcon; color: string; bgColor: string }
> = {
  none: { label: "Začetnik", icon: Users, color: "text-[#E1E1E1]/40", bgColor: "bg-white/[0.04]" },
  bronze: { label: "Bronasti", icon: Medal, color: "text-amber-600", bgColor: "bg-amber-600/10" },
  silver: { label: "Srebrni", icon: Star, color: "text-gray-300", bgColor: "bg-gray-300/10" },
  gold: { label: "Zlati", icon: Trophy, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
  platinum: { label: "Platinasti", icon: Crown, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  diamond: { label: "Diamantni", icon: Gem, color: "text-purple-400", bgColor: "bg-purple-400/10" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMonth(month: string) {
  const [y, m] = month.split("-");
  const date = new Date(Number(y), Number(m) - 1);
  return date.toLocaleDateString("sl-SI", { month: "long", year: "numeric" });
}

// ─── Apply Form ───

function ApplyForm({ onApplied }: { onApplied: () => void }) {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [niche, setNiche] = useState("");
  const [promoPlan, setPromoPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors";
  const selectCls =
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 appearance-none transition-colors";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!audienceSize) {
      setError("Izberite velikost Vaše publike.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/affiliate/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Napaka pri prijavi.");
      setLoading(false);
      return;
    }

    onApplied();
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Partnerski program</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Pridružite se in zaslužite 20% provizije za vsako priporočilo.
      </p>

      {/* Benefits */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: TrendingUp, title: "20% ponavljajoča se provizija", desc: "Za vsako plačljivo naročnino (12 mesecev)" },
          { icon: Gift, title: "Brezplačni paket za občinstvo", desc: "Vaši sledilci začnejo brezplačno — brez obveznosti" },
          { icon: Clock, title: "90-dnevno sledenje", desc: "Dolga doba za konverzijo" },
          { icon: BarChart3, title: "Analitika v realnem času", desc: "Spremljajte vse na enem mestu" },
        ].map((b) => (
          <div key={b.title} className="glass-card rounded-xl p-4 flex gap-3">
            <b.icon className="w-5 h-5 text-[#FEB089] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">{b.title}</p>
              <p className="text-xs text-[#E1E1E1]/40">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 glass-card rounded-xl p-6 space-y-6">
        <h2 className="text-base font-semibold text-white">Prijavite se</h2>

        {/* Section 1: O vas */}
        <div>
          <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-3">O Vas</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Ime in priimek <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Janez Novak"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">Telefonska številka</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+386 40 123 456"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Prisotnost na spletu */}
        <div>
          <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-3">
            Vaša prisotnost na spletu
          </p>
          <p className="text-xs text-[#E1E1E1]/30 mb-3">
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

        {/* Section 3: O vaši publiki */}
        <div>
          <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-3">
            O Vaši publiki
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Velikost publike <span className="text-red-400">*</span>
              </label>
              <select
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
                required
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
                required
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
                required
                rows={3}
                placeholder="Npr. Instagram stories, video recenzije, blog objave, newsletter..."
                className={inputCls + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Partnerska koda */}
        <div>
          <p className="text-xs text-[#FEB089] uppercase tracking-wider font-semibold mb-3">
            Vaša koda
          </p>
          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Partnerska koda <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#E1E1E1]/30">1984.si/?ref=</span>
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

        {error && <p className="text-sm text-red-400/90">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="cta-button py-2.5 px-6 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          Pošljite prijavo
        </button>
      </form>
    </div>
  );
}

// ─── Pending State ───

function PendingState({ code }: { code: string }) {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Partnerski program</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Vaša prijava je v pregledu.
      </p>

      <div className="mt-8 glass-card rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEB089]/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-[#FEB089]" />
        </div>
        <h2 className="text-lg font-semibold text-white">Prijava v pregledu</h2>
        <p className="mt-2 text-sm text-[#E1E1E1]/50 max-w-md mx-auto">
          Vaša prijava s kodo <span className="text-[#FEB089] font-medium">{code}</span>{" "}
          je bila prejeta. Pregledali jo bomo v najkrajšem možnem času.
          Obvestili Vas bomo po e-pošti, ko bo odobrena.
        </p>
      </div>
    </div>
  );
}

// ─── Active Dashboard ───

function ActiveDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [earnings, setEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [statsRes, earningsRes] = await Promise.all([
      fetch("/api/affiliate/stats"),
      fetch("/api/affiliate/earnings"),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (earningsRes.ok) setEarnings(await earningsRes.json());
    setLoading(false);
  }

  function copyToClipboard(text: string, type: "link" | "code") {
    try {
      navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  if (loading || !stats) {
    return (
      <div className="p-8 max-w-5xl flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  const ms = MILESTONE_META[stats.milestone];
  const mp = stats.milestoneProgress;
  const nextMs = mp.next ? MILESTONE_META[mp.next] : null;
  const referralLink = `https://www.1984.si/?ref=${stats.code}`;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Partnerska plošča</h1>
          <p className="mt-1 text-sm text-[#E1E1E1]/50">
            Spremljajte svoje priporočila in zaslužke
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${ms.bgColor}`}>
          <ms.icon className={`w-4 h-4 ${ms.color}`} />
          <span className={`text-sm font-medium ${ms.color}`}>{ms.label}</span>
        </div>
      </div>

      {/* Referral link + code */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-[#FEB089]" />
            <span className="text-xs text-[#E1E1E1]/40 uppercase tracking-wider">Vaša povezava</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-[#E1E1E1]/80 bg-white/[0.04] rounded-lg px-3 py-2 truncate">
              {referralLink}
            </code>
            <button
              onClick={() => copyToClipboard(referralLink, "link")}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#E1E1E1]/50 hover:text-[#E1E1E1] transition-colors"
            >
              {copied === "link" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[#FEB089]" />
            <span className="text-xs text-[#E1E1E1]/40 uppercase tracking-wider">Partnerska koda</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-[#E1E1E1]/80 bg-white/[0.04] rounded-lg px-3 py-2 font-mono uppercase">
              {stats.code}
            </code>
            <button
              onClick={() => copyToClipboard(stats.code, "code")}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#E1E1E1]/50 hover:text-[#E1E1E1] transition-colors"
            >
              {copied === "code" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: MousePointer, label: "Kliki (30 dni)", value: stats.recentClicks },
          { icon: Users, label: "Konverzije", value: stats.total_conversions },
          { icon: TrendingUp, label: "Zaslužek (skupaj)", value: `€${stats.total_earned.toFixed(2)}` },
          { icon: Wallet, label: "Za izplačilo", value: `€${stats.pendingPayout.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#FEB089]" />
              <span className="text-xs text-[#E1E1E1]/40">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Milestone progress */}
      <div className="mt-6 glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ms.icon className={`w-5 h-5 ${ms.color}`} />
            <span className="text-sm font-medium text-white">{ms.label}</span>
          </div>
          {nextMs && (
            <div className="flex items-center gap-2 text-sm text-[#E1E1E1]/40">
              Naslednji: <nextMs.icon className={`w-4 h-4 ${nextMs.color}`} />
              <span className={nextMs.color}>{nextMs.label}</span>
              <span className="text-[#E1E1E1]/20">({mp.nextAt} priporočil)</span>
            </div>
          )}
        </div>
        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FFB288] to-[#EE94B0] transition-all duration-500"
            style={{ width: `${mp.progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#E1E1E1]/30 text-right">
          {stats.total_conversions}{nextMs ? ` / ${mp.nextAt}` : ""} priporočil
        </p>
      </div>

      {/* Monthly earnings */}
      {earnings.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-white mb-4">Mesečni zaslužki</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Mesec
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Konverzije
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Zaslužek
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr key={e.month} className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 text-sm text-[#E1E1E1]/80 capitalize">
                      {formatMonth(e.month)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#E1E1E1]/60">{e.conversions}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">€{e.earnings.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent conversions */}
      {stats.recentConversions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-white mb-4">Zadnje konverzije</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Provizija
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentConversions.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.03]">
                    <td className="px-4 py-3 text-sm text-[#E1E1E1]/60">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-[#E1E1E1]/80 capitalize">{c.plan_id}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">€{c.commission.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        c.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {c.status === "active" ? "Aktivno" : "Preklicano"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commission info */}
      <div className="mt-6 glass-card rounded-xl p-5">
        <h3 className="text-sm font-medium text-[#E1E1E1]/60 mb-2">Informacije</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#E1E1E1]/40">Stopnja provizije</span>
            <p className="text-white font-medium">{stats.commission_rate}%</p>
          </div>
          <div>
            <span className="text-[#E1E1E1]/40">Minimalno izplačilo</span>
            <p className="text-white font-medium">€50,00</p>
          </div>
          <div>
            <span className="text-[#E1E1E1]/40">Izplačila</span>
            <p className="text-white font-medium">Mesečno</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function PartnerjPage() {
  const [state, setState] = useState<"loading" | "none" | "pending" | "active" | "rejected">("loading");
  const [code, setCode] = useState("");

  useEffect(() => {
    checkAffiliate();
  }, []);

  async function autoSubmitAffiliate(): Promise<boolean> {
    // Try localStorage first (Google OAuth flow, same-browser)
    const local = localStorage.getItem("pending_affiliate");
    if (local) {
      try {
        const data = JSON.parse(local);
        localStorage.removeItem("pending_affiliate");
        const res = await fetch("/api/affiliate/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const result = await res.json();
          setCode(result.affiliate?.code || data.code || "");
          setState("pending");
          return true;
        }
      } catch { /* ignore */ }
    }

    // Try user metadata (email/password flow, works cross-browser)
    try {
      const metaRes = await fetch("/api/affiliate/auto-apply", { method: "POST" });
      if (metaRes.ok) {
        const result = await metaRes.json();
        setCode(result.affiliate?.code || "");
        setState("pending");
        return true;
      }
    } catch { /* ignore */ }

    return false;
  }

  async function checkAffiliate() {
    const res = await fetch("/api/affiliate/stats");
    if (res.status === 404) {
      const submitted = await autoSubmitAffiliate();
      if (!submitted) setState("none");
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setCode(data.code || "");
      localStorage.removeItem("pending_affiliate");
      if (data.status === "active") {
        setState("active");
      } else if (data.status === "pending") {
        setState("pending");
      } else {
        setState("rejected");
      }
    } else {
      setState("none");
    }
  }

  if (state === "loading") {
    return (
      <div className="p-8 max-w-5xl flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  if (state === "none") {
    return <ApplyForm onApplied={() => { setState("pending"); checkAffiliate(); }} />;
  }

  if (state === "pending") {
    return <PendingState code={code} />;
  }

  if (state === "rejected") {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-semibold text-white">Partnerski program</h1>
        <div className="mt-8 glass-card rounded-xl p-8 text-center">
          <p className="text-sm text-[#E1E1E1]/50">
            Vaša prijava je bila zavrnjena. Kontaktirajte nas za več informacij.
          </p>
        </div>
      </div>
    );
  }

  return <ActiveDashboard />;
}
