"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CreditCard,
  Loader2,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  PartyPopper,
} from "lucide-react";

type StatusData = {
  planId: string;
  plan: {
    name: string;
    priceEur: string;
    words: number;
    images: number;
    tier: string;
  };
  usage: {
    wordsUsed: number;
    imagesUsed: number;
  };
  subscription: {
    status: string;
    trialEnd: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
};

const PLAN_CARDS = [
  {
    id: "osnovno",
    name: "Osnovno",
    price: "14,90",
    popular: false,
    features: [
      "20.000 besed",
      "200 slik",
      "AI Chat",
      "15 predlog",
      "E-poštna podpora",
    ],
  },
  {
    id: "profesionalno",
    name: "Profesionalno",
    price: "24,90",
    popular: true,
    features: [
      "50.000 besed",
      "500 slik",
      "Vse predloge",
      "Visoka kakovost (Sonnet)",
      "Prednostna podpora",
    ],
  },
  {
    id: "poslovno",
    name: "Poslovno",
    price: "39,90",
    popular: false,
    features: [
      "100.000 besed",
      "1.000 slik",
      "API dostop",
      "Lastni podatki",
      "Telefonska podpora",
    ],
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatNumber(n: number): string {
  return n.toLocaleString("sl-SI");
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: {
      label: "Aktivno",
      cls: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    trialing: {
      label: "Preizkusno obdobje",
      cls: "bg-[#FEB089]/10 text-[#FEB089] border-[#FEB089]/20",
    },
    past_due: {
      label: "Zamuda s plačilom",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    canceled: {
      label: "Preklicano",
      cls: "bg-[#E1E1E1]/10 text-[#E1E1E1]/50 border-white/10",
    },
    inactive: {
      label: "Neaktivno",
      cls: "bg-[#E1E1E1]/10 text-[#E1E1E1]/50 border-white/10",
    },
  };
  const info = map[status] || map.inactive;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${info.cls}`}
    >
      {info.label}
    </span>
  );
}

function UsageBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const pct = Math.min((used / total) * 100, 100);
  const isHigh = pct > 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[#E1E1E1]/60">{label}</span>
        <span className="text-sm text-[#E1E1E1]/80">
          {formatNumber(used)}{" "}
          <span className="text-[#E1E1E1]/30">/ {formatNumber(total)}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isHigh
              ? "bg-gradient-to-r from-red-400 to-red-500"
              : "bg-gradient-to-r from-[#FFB288] to-[#EE94B0]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function NarocninaPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/status");
      if (res.ok) {
        setStatus(await res.json());
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    }
    setCheckoutLoading(null);
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    }
    setPortalLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  const sub = status?.subscription;
  const isActive = sub?.status === "active" || sub?.status === "trialing";
  const isTrial = sub?.status === "trialing";
  const trialDaysLeft =
    isTrial && sub?.trialEnd
      ? Math.max(
          0,
          Math.ceil(
            (new Date(sub.trialEnd).getTime() - Date.now()) / 86_400_000
          )
        )
      : 0;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-white">Naročnina</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Upravljajte vaš paket in spremljajte porabo
      </p>

      {/* Success / cancel banners */}
      {success && (
        <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <PartyPopper className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">
            Naročnina je bila uspešno aktivirana! Vaše 5-dnevno brezplačno
            obdobje se je začelo.
          </p>
        </div>
      )}
      {canceled && (
        <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FEB089]/10 border border-[#FEB089]/20">
          <AlertTriangle className="w-5 h-5 text-[#FEB089] shrink-0" />
          <p className="text-sm text-[#FEB089]/80">
            Plačilo je bilo preklicano. Lahko poskusite znova kadarkoli.
          </p>
        </div>
      )}

      {/* Current plan card */}
      <div className="mt-8 glass-card rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                {status?.plan.name || "Brezplačno"}
              </h2>
              {sub && <StatusBadge status={sub.status} />}
              {!sub && <StatusBadge status="inactive" />}
            </div>

            {isTrial && trialDaysLeft > 0 && (
              <p className="mt-2 text-sm text-[#FEB089]/80">
                Preizkusno obdobje: še {trialDaysLeft}{" "}
                {trialDaysLeft === 1
                  ? "dan"
                  : trialDaysLeft === 2
                    ? "dneva"
                    : trialDaysLeft <= 4
                      ? "dnevi"
                      : "dni"}
              </p>
            )}

            {isActive && sub?.currentPeriodEnd && !isTrial && (
              <p className="mt-2 text-sm text-[#E1E1E1]/40">
                Naslednje zaračunavanje: {formatDate(sub.currentPeriodEnd)}
              </p>
            )}

            {sub?.cancelAtPeriodEnd && sub?.currentPeriodEnd && (
              <p className="mt-2 text-sm text-red-400/80">
                Naročnina se izteče {formatDate(sub.currentPeriodEnd)}
              </p>
            )}

            {status?.planId === "free" && !sub && (
              <p className="mt-2 text-sm text-[#E1E1E1]/40">
                Nadgradite za več besed, slik in napredne funkcije.
              </p>
            )}
          </div>

          {isActive && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/70 hover:text-[#E1E1E1] hover:bg-white/[0.08] transition-colors duration-200 disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Upravljaj naročnino
            </button>
          )}
        </div>
      </div>

      {/* Usage meters */}
      {status && (
        <div className="mt-6 glass-card rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-medium text-[#E1E1E1]/60 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Mesečna poraba
          </h3>
          <UsageBar
            label="Besede"
            used={status.usage.wordsUsed}
            total={status.plan.words}
          />
          <UsageBar
            label="Slike"
            used={status.usage.imagesUsed}
            total={status.plan.images}
          />
        </div>
      )}

      {/* Plan cards */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white mb-6">Paketi</h2>
        <p className="text-sm text-[#E1E1E1]/40 mb-6">
          Vsi paketi vključujejo 5-dnevno brezplačno preizkusno obdobje.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_CARDS.map((plan) => {
            const isCurrent = status?.planId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-[0_8px_32px_rgba(254,176,137,0.06)]"
                    : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="cta-gradient text-xs font-bold text-[#171717] px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      Priljubljeno
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    &euro;{plan.price}
                  </span>
                  <span className="text-[#E1E1E1]/40 text-sm">/mesec</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2.5 text-sm text-[#E1E1E1]/70"
                    >
                      <Check className="w-4 h-4 text-[#FEB089] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && handleCheckout(plan.id)}
                  disabled={isCurrent || checkoutLoading === plan.id}
                  className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/40 cursor-default"
                      : plan.popular
                        ? "cta-button"
                        : "gradient-border-btn text-[#E1E1E1] hover:text-white"
                  }`}
                >
                  {checkoutLoading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    <>
                      <Check className="w-4 h-4" />
                      Trenutni paket
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Izberi paket
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
