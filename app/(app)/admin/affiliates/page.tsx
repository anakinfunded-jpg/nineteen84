"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Users,
  TrendingUp,
  Wallet,
  MousePointer,
  Loader2,
  Check,
  X,
  Pause,
  Play,
  Eye,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Plus,
} from "lucide-react";

type AffiliateItem = {
  id: string;
  code: string;
  status: string;
  commission_rate: number;
  total_clicks: number;
  total_conversions: number;
  total_earned: number;
  total_paid: number;
  milestone: string;
  full_name: string | null;
  phone: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
  website: string | null;
  audience_size: string | null;
  niche: string | null;
  promo_plan: string | null;
  note: string | null;
  email: string;
  name: string;
  created_at: string;
};

type Summary = {
  total: number;
  active: number;
  pending: number;
  totalEarned: number;
  totalPaid: number;
  totalOwed: number;
  totalConversions: number;
  totalClicks: number;
  conversionRate: number;
};

type Payout = {
  id: string;
  affiliate_id: string;
  amount: number;
  period: string;
  status: string;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  affiliate_code: string;
  affiliate_email: string;
};

type Tab = "overview" | "affiliates" | "payouts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#FEB089]/10 text-[#FEB089] border-[#FEB089]/20",
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    paid: "bg-green-500/10 text-green-400 border-green-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const labels: Record<string, string> = {
    pending: "V pregledu",
    active: "Aktivno",
    paused: "Zaustavljeno",
    rejected: "Zavrnjeno",
    paid: "Plačano",
    processing: "V obdelavi",
    failed: "Neuspelo",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </span>
  );
}

function MilestoneBadge({ milestone }: { milestone: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    none: { label: "—", cls: "text-[#E1E1E1]/30" },
    bronze: { label: "Bronasti", cls: "text-amber-600" },
    silver: { label: "Srebrni", cls: "text-gray-300" },
    gold: { label: "Zlati", cls: "text-yellow-400" },
    platinum: { label: "Platinasti", cls: "text-blue-400" },
    diamond: { label: "Diamantni", cls: "text-purple-400" },
  };
  const m = map[milestone] || map.none;
  return <span className={`text-xs font-medium ${m.cls}`}>{m.label}</span>;
}

export default function AdminAffiliatesPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Payout form
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAffId, setPayoutAffId] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [affRes, payRes] = await Promise.all([
      fetch("/api/admin/affiliates"),
      fetch("/api/admin/affiliates/payouts"),
    ]);
    if (affRes.ok) {
      const data = await affRes.json();
      setAffiliates(data.affiliates || []);
      setSummary(data.summary || null);
    }
    if (payRes.ok) {
      setPayouts(await payRes.json());
    }
    setLoading(false);
  }

  async function updateAffiliate(id: string, updates: Record<string, unknown>) {
    setActionLoading(id);
    await fetch(`/api/admin/affiliates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await loadData();
    setActionLoading(null);
  }

  async function handleCreatePayout(e: FormEvent) {
    e.preventDefault();
    setPayoutLoading(true);
    await fetch("/api/admin/affiliates/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        affiliateId: payoutAffId,
        amount: payoutAmount,
        period: payoutPeriod,
        notes: payoutNotes || undefined,
      }),
    });
    setShowPayoutForm(false);
    setPayoutAffId("");
    setPayoutAmount("");
    setPayoutPeriod("");
    setPayoutNotes("");
    setPayoutLoading(false);
    await loadData();
  }

  async function markPayoutPaid(payoutId: string) {
    setActionLoading(payoutId);
    await fetch("/api/admin/affiliates/payouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId, status: "paid" }),
    });
    await loadData();
    setActionLoading(null);
  }

  const filteredAffiliates =
    statusFilter === "all"
      ? affiliates
      : affiliates.filter((a) => a.status === statusFilter);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">Partnerji (Admin)</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Upravljajte partnerski program, odobritve in izplačila
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-white/[0.06]">
        {(
          [
            { id: "overview", label: "Pregled" },
            { id: "affiliates", label: "Partnerji" },
            { id: "payouts", label: "Izplačila" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
              tab === t.id
                ? "border-[#FEB089] text-white"
                : "border-transparent text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {tab === "overview" && summary && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Skupaj partnerjev", value: summary.total },
              { icon: Check, label: "Aktivnih", value: summary.active },
              { icon: Eye, label: "V pregledu", value: summary.pending },
              { icon: MousePointer, label: "Skupaj klikov", value: summary.totalClicks },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-4 h-4 text-[#FEB089]" />
                  <span className="text-xs text-[#E1E1E1]/40">{s.label}</span>
                </div>
                <p className="text-2xl font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "Skupaj konverzij", value: summary.totalConversions },
              { icon: Wallet, label: "Zasluženo (skupaj)", value: `€${summary.totalEarned.toFixed(2)}` },
              { icon: DollarSign, label: "Plačano", value: `€${summary.totalPaid.toFixed(2)}` },
              { icon: Wallet, label: "Za izplačilo", value: `€${summary.totalOwed.toFixed(2)}` },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-4 h-4 text-[#FEB089]" />
                  <span className="text-xs text-[#E1E1E1]/40">{s.label}</span>
                </div>
                <p className="text-2xl font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 glass-card rounded-xl p-4">
            <span className="text-xs text-[#E1E1E1]/40">Konverzijska stopnja (kliki → konverzije)</span>
            <p className="text-2xl font-semibold text-white mt-1">{summary.conversionRate}%</p>
          </div>
        </div>
      )}

      {/* ─── Affiliates Tab ─── */}
      {tab === "affiliates" && (
        <div className="mt-6">
          {/* Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "pending", "active", "paused", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-[#FEB089]/10 text-[#FEB089] border border-[#FEB089]/20"
                    : "bg-white/[0.04] text-[#E1E1E1]/40 border border-white/[0.06] hover:text-[#E1E1E1]/70"
                }`}
              >
                {f === "all" ? "Vsi" : f === "pending" ? "V pregledu" : f === "active" ? "Aktivni" : f === "paused" ? "Zaustavljeni" : "Zavrnjeni"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Partner</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Koda</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden md:table-cell">Kliki</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden md:table-cell">Konv.</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden lg:table-cell">Zaslužek</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden lg:table-cell">Mejnik</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAffiliates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#E1E1E1]/30">
                      Ni partnerjev s tem filtrom.
                    </td>
                  </tr>
                ) : (
                  filteredAffiliates.map((aff) => (
                    <>
                      <tr
                        key={aff.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === aff.id ? null : aff.id)}
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm text-white">{aff.name || aff.email}</p>
                          <p className="text-xs text-[#E1E1E1]/30">{aff.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#E1E1E1]/60 font-mono">{aff.code}</td>
                        <td className="px-4 py-3"><StatusBadge status={aff.status} /></td>
                        <td className="px-4 py-3 text-sm text-[#E1E1E1]/60 hidden md:table-cell">{aff.total_clicks}</td>
                        <td className="px-4 py-3 text-sm text-[#E1E1E1]/60 hidden md:table-cell">{aff.total_conversions}</td>
                        <td className="px-4 py-3 text-sm text-white font-medium hidden lg:table-cell">€{Number(aff.total_earned).toFixed(2)}</td>
                        <td className="px-4 py-3 hidden lg:table-cell"><MilestoneBadge milestone={aff.milestone} /></td>
                        <td className="px-4 py-3">
                          {expandedId === aff.id ? (
                            <ChevronUp className="w-4 h-4 text-[#E1E1E1]/30" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#E1E1E1]/30" />
                          )}
                        </td>
                      </tr>
                      {expandedId === aff.id && (
                        <tr key={`${aff.id}-expand`} className="border-b border-white/[0.06]">
                          <td colSpan={8} className="px-4 py-4 bg-white/[0.01]">
                            <div className="flex flex-wrap gap-3 mb-4">
                              {/* Action buttons */}
                              {aff.status === "pending" && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateAffiliate(aff.id, { status: "active" }); }}
                                    disabled={actionLoading === aff.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Odobri
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateAffiliate(aff.id, { status: "rejected" }); }}
                                    disabled={actionLoading === aff.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" /> Zavrni
                                  </button>
                                </>
                              )}
                              {aff.status === "active" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateAffiliate(aff.id, { status: "paused" }); }}
                                  disabled={actionLoading === aff.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                                >
                                  <Pause className="w-3.5 h-3.5" /> Zaustavi
                                </button>
                              )}
                              {aff.status === "paused" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateAffiliate(aff.id, { status: "active" }); }}
                                  disabled={actionLoading === aff.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                >
                                  <Play className="w-3.5 h-3.5" /> Aktiviraj
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-[#E1E1E1]/40">Provizija</span>
                                <p className="text-white">{aff.commission_rate}%</p>
                              </div>
                              <div>
                                <span className="text-[#E1E1E1]/40">Plačano</span>
                                <p className="text-white">€{Number(aff.total_paid).toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="text-[#E1E1E1]/40">Za izplačilo</span>
                                <p className="text-white">€{(Number(aff.total_earned) - Number(aff.total_paid)).toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="text-[#E1E1E1]/40">Pridružen</span>
                                <p className="text-white">{formatDate(aff.created_at)}</p>
                              </div>
                            </div>

                            {/* Contact & audience */}
                            {(aff.full_name || aff.phone || aff.audience_size || aff.niche) && (
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                {aff.full_name && (
                                  <div>
                                    <span className="text-[#E1E1E1]/40">Ime</span>
                                    <p className="text-white">{aff.full_name}</p>
                                  </div>
                                )}
                                {aff.phone && (
                                  <div>
                                    <span className="text-[#E1E1E1]/40">Telefon</span>
                                    <p className="text-white">{aff.phone}</p>
                                  </div>
                                )}
                                {aff.audience_size && (
                                  <div>
                                    <span className="text-[#E1E1E1]/40">Publika</span>
                                    <p className="text-white">{aff.audience_size}</p>
                                  </div>
                                )}
                                {aff.niche && (
                                  <div>
                                    <span className="text-[#E1E1E1]/40">Niša</span>
                                    <p className="text-white capitalize">{aff.niche}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Socials */}
                            {(aff.instagram || aff.tiktok || aff.youtube || aff.linkedin || aff.website) && (
                              <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#E1E1E1]/50">
                                {aff.instagram && <span>IG: {aff.instagram}</span>}
                                {aff.tiktok && <span>TT: {aff.tiktok}</span>}
                                {aff.youtube && <span>YT: {aff.youtube}</span>}
                                {aff.linkedin && <span>LI: {aff.linkedin}</span>}
                                {aff.website && <span>Web: {aff.website}</span>}
                              </div>
                            )}

                            {aff.promo_plan && (
                              <p className="mt-3 text-xs text-[#E1E1E1]/50">
                                <span className="text-[#E1E1E1]/40">Promocijski plan:</span> {aff.promo_plan}
                              </p>
                            )}

                            {aff.note && (
                              <p className="mt-3 text-xs text-[#E1E1E1]/40 italic">Opomba: {aff.note}</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Payouts Tab ─── */}
      {tab === "payouts" && (
        <div className="mt-6">
          <button
            onClick={() => setShowPayoutForm(!showPayoutForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cta-button mb-4"
          >
            <Plus className="w-4 h-4" />
            Novo izplačilo
          </button>

          {showPayoutForm && (
            <form onSubmit={handleCreatePayout} className="glass-card rounded-xl p-5 mb-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">Partner *</label>
                  <select
                    value={payoutAffId}
                    onChange={(e) => setPayoutAffId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 appearance-none"
                  >
                    <option value="" className="bg-[#191919]">Izberite partnerja</option>
                    {affiliates
                      .filter((a) => a.status === "active")
                      .map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#191919]">
                          {a.name || a.email} ({a.code}) — za izplačilo: €{(Number(a.total_earned) - Number(a.total_paid)).toFixed(2)}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">Znesek (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">Obdobje * (npr. 2026-02)</label>
                  <input
                    type="text"
                    value={payoutPeriod}
                    onChange={(e) => setPayoutPeriod(e.target.value)}
                    required
                    placeholder="2026-02"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">Opomba</label>
                  <input
                    type="text"
                    value={payoutNotes}
                    onChange={(e) => setPayoutNotes(e.target.value)}
                    placeholder="Opcijsko"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={payoutLoading}
                className="cta-button py-2 px-6 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {payoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Ustvari izplačilo
              </button>
            </form>
          )}

          {/* Payouts table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Partner</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Znesek</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Obdobje</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden md:table-cell">Datum</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#E1E1E1]/30">
                      Ni izplačil.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm text-[#E1E1E1]/80">{p.affiliate_code}</p>
                        <p className="text-xs text-[#E1E1E1]/30">{p.affiliate_email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">€{Number(p.amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-[#E1E1E1]/60">{p.period}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-sm text-[#E1E1E1]/40 hidden md:table-cell">
                        {p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && (
                          <button
                            onClick={() => markPayoutPaid(p.id)}
                            disabled={actionLoading === p.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === p.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Plačano
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
