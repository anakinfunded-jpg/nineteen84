import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { features, categories } from "@/lib/marketing/features";
import {
  Check,
  Zap,
  Globe,
  Shield,
  Clock,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Osnovno",
    price: "14,90",
    popular: false,
    features: [
      "20.000 besed / mesec",
      "200 slik / mesec",
      "AI Chat, Besedila, Dokumenti",
      "15 predlog za besedila",
      "AI Prevajalnik (6 jezikov)",
      "50 generiranj zvoka",
      "100 analiz slik",
      "E-poštna podpora",
    ],
  },
  {
    name: "Profesionalno",
    price: "24,90",
    popular: true,
    features: [
      "50.000 besed / mesec",
      "500 slik / mesec",
      "Vse funkcije vključene",
      "Vse predloge za besedila",
      "Napredni AI model (Sonnet)",
      "200 generiranj zvoka",
      "500 analiz slik",
      "100 inpainting urejanj",
      "100 dokumentov v AI Spomin",
      "Prednostna podpora",
    ],
  },
  {
    name: "Poslovno",
    price: "39,90",
    popular: false,
    features: [
      "100.000 besed / mesec",
      "1.000 slik / mesec",
      "Vse funkcije — brez omejitev",
      "Napredni AI model (Sonnet)",
      "Neomejeno generiranje zvoka",
      "Neomejene analize slik",
      "Neomejeno inpainting urejanj",
      "Neomejeno dokumentov",
      "API dostop",
      "Telefonska podpora",
    ],
  },
];

const useCases = [
  {
    title: "Marketinške ekipe",
    desc: "Ustvarjajte vsebine za družbena omrežja, e-poštne kampanje in opise izdelkov 10x hitreje.",
  },
  {
    title: "Podjetniki",
    desc: "Pripravite profesionalna besedila, slike in dokumente brez zaposlovanja dodatnega kadra.",
  },
  {
    title: "Spletni trgovci",
    desc: "Generirajte opise izdelkov, oglase in grafike za celoten katalog v minutah.",
  },
  {
    title: "Agencije",
    desc: "Pospešite produkcijo vsebin za stranke z AI asistentom, ki razume slovenščino.",
  },
  {
    title: "Blogerji in ustvarjalci",
    desc: "Premagajte pisateljski blok in ustvarjajte članke, objave in grafike z lahkoto.",
  },
  {
    title: "Prevajalci",
    desc: "Pridobite kakovostne osnutke prevodov in jih izpopolnite — prihranite ure dela.",
  },
];

const valueProps: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap, title: "10x hitrejše ustvarjanje", desc: "Besedilo, ki bi ga pisali uro, AI ustvari v 60 sekundah. Več časa za strategijo." },
  { icon: Globe, title: "Brezhibna slovenščina", desc: "Edina AI platforma, optimizirana za slovenski jezik. Naravna besedila brez tujk." },
  { icon: Shield, title: "Vaši podatki, vaša last", desc: "Generirane vsebine so vaša last. Podatkov ne delimo in ne treniramo AI z njimi." },
  { icon: Lightbulb, title: "Nikoli brez idej", desc: "AI pomaga premagati pisateljski blok in generira nove ideje na podlagi vaših navodil." },
  { icon: Clock, title: "Na voljo 24/7", desc: "AI ne potrebuje odmora. Ustvarjajte vsebine kadarkoli — tudi ob 3. uri zjutraj." },
  { icon: TrendingUp, title: "Besedila, ki prodajajo", desc: "Predloge temeljijo na preizkušenih copywriting formulah za višje konverzije." },
];

const howItWorks = [
  { step: "1", title: "Izberite orodje", desc: "Izberite med 11 AI orodji — od besedil do slik in zvoka." },
  { step: "2", title: "Vnesite navodila", desc: "Opišite, kaj potrebujete. V slovenščini, seveda." },
  { step: "3", title: "Pridobite rezultat", desc: "AI ustvari vsebino v sekundah. Uredite, kopirajte ali prenesite." },
];

export default function HomePage() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[1000px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(254,176,137,0.05), transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
              Prva slovenska AI platforma
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-serif tracking-[0.01em] leading-[1.1]">
              Vaš AI marketinški
              <br />
              <span className="logo-gradient">tim v eni aplikaciji.</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-8 text-lg md:text-xl text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              Prodajna besedila, e-maili, slike, zvok, prevodi in dokumenti — vse
              v brezhibni slovenščini. 11 AI orodij na enem mestu.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registracija"
                className="cta-button px-8 py-3.5 rounded-full font-semibold text-base flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Preizkusi brezplačno
              </Link>
              <Link
                href="/funkcije"
                className="gradient-border-btn px-8 py-3.5 rounded-full font-semibold text-base text-[#E1E1E1]"
              >
                Poglej funkcije
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <p className="mt-6 text-sm text-[#E1E1E1]/30">
              Brezplačen paket — brez kreditne kartice
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== FEATURES GRID ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                11 AI orodij
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Vse kar potrebujete za
                <br />
                popolno slovensko vsebino
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <AnimateOnScroll key={feature.slug} delay={i * 50}>
                <Link
                  href={`/funkcije/${feature.slug}`}
                  className="glass-card group p-5 rounded-2xl hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] transition-all duration-300 h-full flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-white/[0.06] transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-[#FEB089]" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#E1E1E1]/40 leading-relaxed flex-1">
                    {feature.shortDesc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#FEB089] opacity-60 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    Več o tem <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                Kako deluje
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                3 preprosti koraki
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 100}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl cta-gradient flex items-center justify-center text-xl font-bold text-[#171717]">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#E1E1E1]/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VALUE PROPS ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                Prednosti
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Zakaj izbrati 1984?
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 80}>
                <div className="glass-card p-6 rounded-2xl h-full">
                  <item.icon className="w-8 h-8 text-[#FEB089] mb-4" />
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#E1E1E1]/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== USE CASES ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                Za koga
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Komu pomaga 1984?
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 80}>
                <div className="glass-card p-6 rounded-2xl h-full">
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#E1E1E1]/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section id="cenik" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                Cenik
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Preprosti in transparentni paketi
              </h2>
              <p className="mt-4 text-[#E1E1E1]/50">
                Vsi paketi vključujejo brezplačno preizkusno obdobje. Brez vezave.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <AnimateOnScroll key={plan.name} delay={i * 100}>
                <div
                  className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-linear-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-[0_8px_32px_rgba(254,176,137,0.08)] md:scale-[1.03]"
                      : "glass-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="cta-gradient text-xs font-bold text-[#171717] px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                        Priljubljeno
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      €{plan.price}
                    </span>
                    <span className="text-[#E1E1E1]/40 text-sm">/mesec</span>
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-3 text-sm text-[#E1E1E1]/70"
                      >
                        <Check className="w-4 h-4 text-[#FEB089] shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/registracija"
                    className={`mt-8 block text-center py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                      plan.popular
                        ? "cta-button"
                        : "gradient-border-btn text-[#E1E1E1] hover:text-white"
                    }`}
                  >
                    Začni brezplačno
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
              Dajte priložnost umetni
              <br />
              inteligenci in prihranite
              <br />
              <span className="logo-gradient">ure dela vsak teden.</span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <p className="mt-6 text-lg text-[#E1E1E1]/50">
              Največja in najobsežnejša slovenska AI aplikacija.
              11 orodij, 40+ predlog, vse v slovenščini.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="mt-10">
              <Link
                href="/registracija"
                className="cta-button px-10 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Preizkusi 1984 brezplačno
              </Link>
              <p className="mt-4 text-sm text-[#E1E1E1]/30">
                Brezplačen paket — brez kreditne kartice — odpoved kadarkoli
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
