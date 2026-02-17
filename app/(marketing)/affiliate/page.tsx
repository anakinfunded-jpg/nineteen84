import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Share2,
  Wallet,
  TrendingUp,
  Gift,
  Clock,
  BarChart3,
  ArrowRight,
  Trophy,
  Star,
  Crown,
  Medal,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnerski program | 1984 — AI, ki piše slovensko",
  description:
    "Zaslužite 20% provizije za vsako priporočilo. Pridružite se partnerskemu programu 1984 in pomagajte slovenskim podjetjem odkriti moč AI.",
};

const steps = [
  {
    icon: Users,
    title: "Prijavite se",
    desc: "Ustvarite brezplačen račun in se prijavite v partnerski program. Dobite unikatno povezavo in kodo za popust.",
  },
  {
    icon: Share2,
    title: "Delite",
    desc: "Delite svojo partnersko povezavo na družbenih omrežjih, blogu ali neposredno s podjetji, ki jih poznate.",
  },
  {
    icon: Wallet,
    title: "Zaslužite",
    desc: "Zaslužite 20% provizije za vsako plačljivo naročnino — 12 mesecev za vsakega uporabnika.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "20% ponavljajoča se provizija",
    desc: "Zaslužite vsak mesec, 12 mesecev za vsakega priporočenega uporabnika.",
  },
  {
    icon: Gift,
    title: "21-dnevni brezplačni preizkus",
    desc: "Vaši sledilci dobijo podaljšan 21-dnevni preizkus namesto standardnih 5 dni — lažje priporočanje.",
  },
  {
    icon: Clock,
    title: "90-dnevno sledenje",
    desc: "Piškotek za sledenje je aktiven 90 dni. Tudi če se nekdo naroči čez teden, dobite provizijo.",
  },
  {
    icon: BarChart3,
    title: "Pregledi in analitika",
    desc: "Spremljajte klike, registracije in zaslužke v realnem času na vaši partnerski nadzorni plošči.",
  },
];

const milestones = [
  {
    icon: Medal,
    level: "Bronasti",
    min: 5,
    reward: "Uvrstitev med uradne partnerje 1984",
    color: "from-amber-700 to-amber-600",
  },
  {
    icon: Star,
    level: "Srebrni",
    min: 15,
    reward: "Prednostna podpora za partnerje",
    color: "from-gray-400 to-gray-300",
  },
  {
    icon: Trophy,
    level: "Zlati",
    min: 50,
    reward: "Neposredni kontakt z ekipo 1984",
    color: "from-yellow-500 to-yellow-400",
  },
  {
    icon: Crown,
    level: "Platinasti",
    min: 100,
    reward: "Nadgradnja na 25% provizijo",
    color: "from-blue-400 to-blue-300",
  },
];

export default async function AffiliatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/partnerji" : "/registracija?redirect=/partnerji";
  const loginHref = user ? "/partnerji" : "/prijava?redirect=/partnerji";

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FEB089]/[0.03] to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] accent-gradient mb-6">
              Partnerski program
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="text-4xl md:text-6xl font-serif tracking-[0.01em] text-white leading-[1.15]">
              Zaslužite z{" "}
              <span className="logo-gradient">1984</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              Pridružite se našemu partnerskemu programu in zaslužite{" "}
              <span className="text-white font-semibold">20% ponavljajočo provizijo</span>{" "}
              za vsako priporočilo. Vaše občinstvo dobi{" "}
              <span className="text-white font-semibold">21-dnevni brezplačni preizkus</span>.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ctaHref}
                className="cta-button px-8 py-3.5 rounded-full font-semibold text-sm inline-flex items-center gap-2"
              >
                {user ? "Odpri partnersko ploščo" : "Pridružite se brezplačno"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!user && (
                <Link
                  href={loginHref}
                  className="gradient-border-btn px-8 py-3.5 rounded-full font-semibold text-sm text-[#E1E1E1]"
                >
                  Že imam račun
                </Link>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] accent-gradient mb-4">
                Kako deluje
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
                Trije preprosti koraki
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimateOnScroll key={step.title} delay={i * 100}>
                <div className="glass-card rounded-2xl p-8 text-center relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-7 h-7 accent-icon" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-sm font-bold text-[#E1E1E1]/20">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#E1E1E1]/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] accent-gradient mb-4">
                Prednosti
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
                Zakaj postati partner
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <AnimateOnScroll key={b.title} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6 accent-icon" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {b.title}
                    </h3>
                    <p className="text-sm text-[#E1E1E1]/50 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings example */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] accent-gradient mb-4">
                Zaslužek
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
                Koliko lahko zaslužite
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                      Paket
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                      Cena
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                      Vaša provizija
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden sm:table-cell">
                      Letno (1 uporabnik)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Osnovno", price: "16,90", comm: "3,38", yearly: "40,56" },
                    { name: "Profesionalno", price: "39,90", comm: "7,98", yearly: "95,76" },
                    { name: "Poslovno", price: "84,90", comm: "16,98", yearly: "203,76" },
                  ].map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#E1E1E1]/60">
                        &euro;{row.price}/mesec
                      </td>
                      <td className="px-6 py-4 text-sm accent-gradient font-semibold">
                        &euro;{row.comm}/mesec
                      </td>
                      <td className="px-6 py-4 text-sm text-[#E1E1E1]/60 hidden sm:table-cell">
                        &euro;{row.yearly}/leto
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-4 text-center text-sm text-[#E1E1E1]/30">
              Primer: 20 uporabnikov na Profesionalnem paketu = &euro;159,60/mesec (provizija traja 12 mesecev)
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] accent-gradient mb-4">
                Mejniki
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
                Nagrade za uspeh
              </h2>
              <p className="mt-4 text-[#E1E1E1]/50 max-w-xl mx-auto">
                Več kot priporočite, boljše nagrade dobite. Vsak mejnik prinaša posebne ugodnosti.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-4">
            {milestones.map((m, i) => (
              <AnimateOnScroll key={m.level} delay={i * 80}>
                <div className="glass-card rounded-xl p-5 flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}>
                    <m.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-white">
                        {m.level}
                      </h3>
                      <span className="text-xs text-[#E1E1E1]/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
                        {m.min}+ priporočil
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#E1E1E1]/50">
                      {m.reward}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
              Pripravljeni na zaslužek?
            </h2>
            <p className="mt-4 text-[#E1E1E1]/50 max-w-xl mx-auto">
              {user
                ? "Odprite partnersko nadzorno ploščo in začnite deliti svojo povezavo."
                : "Registrirajte se brezplačno in se prijavite v partnerski program. Začnete lahko deliti že danes."}
            </p>
            <Link
              href={ctaHref}
              className="mt-8 cta-button px-10 py-4 rounded-full font-semibold text-sm inline-flex items-center gap-2"
            >
              {user ? "Odpri partnersko ploščo" : "Začnite zdaj"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
