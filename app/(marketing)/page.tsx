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
    name: "Brezplačno",
    price: "0",
    desc: "Za preizkus platforme",
    popular: false,
    features: [
      "5.000 besed / mesec",
      "10 slik / mesec",
      "AI Chat, Besedila, Dokumenti",
      "5 predlog za besedila",
      "AI Prevajalnik (3 jeziki)",
      "5 generiranj zvoka",
      "10 analiz slik (OCR)",
      "E-poštna podpora",
    ],
    cta: "Začni brezplačno",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Osnovno",
    price: "14,90",
    desc: "Za podjetnike in posameznike",
    popular: false,
    features: [
      "20.000 besed / mesec",
      "200 slik / mesec",
      "AI Chat, Besedila, Dokumenti",
      "15 predlog za besedila",
      "AI Prevajalnik (6 jezikov)",
      "50 generiranj zvoka",
      "100 analiz slik (OCR)",
      "E-poštna podpora",
    ],
    cta: "Začni brezplačno",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Profesionalno",
    price: "24,90",
    desc: "Za marketinške ekipe in agencije",
    popular: true,
    features: [
      "50.000 besed / mesec",
      "500 slik / mesec",
      "Vse funkcije vključene",
      "Vse predloge za besedila",
      "Napredni AI model (Sonnet)",
      "200 generiranj zvoka",
      "500 analiz slik (OCR)",
      "100 inpainting urejanj",
      "100 dokumentov v AI Spomin",
      "Prednostna podpora",
    ],
    cta: "Začni brezplačno",
    ctaStyle: "cta-button",
  },
  {
    name: "Poslovno",
    price: "39,90",
    desc: "Za velika podjetja in organizacije",
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
    cta: "Začni brezplačno",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
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
            <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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
                    <feature.icon className="w-5 h-5 accent-icon" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#E1E1E1]/40 leading-relaxed flex-1">
                    {feature.shortDesc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs accent-gradient opacity-60 lg:opacity-0 group-hover:opacity-100 transition-opacity">
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
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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
                  <item.icon className="w-8 h-8 accent-icon mb-4" />
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

      {/* ===================== SAVE MONEY ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
                Prihranite
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Vse na enem mestu —
                <br />
                <span className="logo-gradient">za delček cene.</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="mt-4 text-[#E1E1E1]/50 max-w-xl mx-auto">
                Namesto plačevanja 6 različnih orodij, dobite vse v eni
                aplikaciji — prilagojeni za slovenščino.
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={300}>
            <div className="mt-14 glass-card rounded-2xl p-8 md:p-10">
              <div className="space-y-4">
                {[
                  { name: "ChatGPT Plus", what: "AI pogovor in besedila", price: "20" },
                  { name: "Canva Pro", what: "Grafično oblikovanje", price: "12" },
                  { name: "Adobe Photoshop", what: "Urejanje slik", price: "24" },
                  { name: "DeepL Pro", what: "Prevajanje besedil", price: "9" },
                  { name: "ElevenLabs", what: "Pretvorba besedila v govor", price: "5" },
                  { name: "Grammarly", what: "Preverjanje slovnice", price: "12" },
                ].map((tool, i) => (
                  <div
                    key={tool.name}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">
                        {tool.name}
                      </span>
                      <span className="text-xs text-[#E1E1E1]/30 ml-2">
                        {tool.what}
                      </span>
                    </div>
                    <span className="text-sm text-[#E1E1E1]/50">
                      &euro;{tool.price}/mesec
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-xs text-[#E1E1E1]/30 uppercase tracking-wider">
                      Skupaj posamično
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#E1E1E1]/30 line-through">
                      &euro;82/mesec
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs accent-gradient uppercase tracking-wider font-semibold">
                      1984 Profesionalno
                    </p>
                    <p className="mt-1 text-4xl font-bold text-white">
                      &euro;24,90
                      <span className="text-sm font-normal text-[#E1E1E1]/40">
                        /mesec
                      </span>
                    </p>
                    <p className="mt-1 text-sm accent-gradient font-semibold">
                      Prihranite ~&euro;57 na mesec
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/registracija"
                  className="cta-button px-8 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Preizkusi brezplačno
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== USE CASES ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
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

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {plans.map((plan, i) => (
              <AnimateOnScroll key={plan.name} delay={i * 100}>
                <div
                  className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-linear-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-[0_8px_32px_rgba(254,176,137,0.08)]"
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

                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#E1E1E1]/40 mt-1">{plan.desc}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    {plan.price === "0" ? (
                      <span className="text-4xl font-bold text-white">
                        Brezplačno
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-white">
                          &euro;{plan.price}
                        </span>
                        <span className="text-[#E1E1E1]/40 text-sm">
                          /mesec
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="mt-7 space-y-2.5">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-[#E1E1E1]/70"
                      >
                        <Check className="w-4 h-4 accent-icon shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/registracija"
                    className={`mt-7 block text-center py-3 rounded-full font-semibold text-sm transition-all duration-200 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
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
