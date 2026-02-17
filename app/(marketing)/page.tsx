import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { DashboardPreview } from "@/components/marketing/dashboard-mockup";
import { features, categories } from "@/lib/marketing/features";
import {
  Check,
  Zap,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Briefcase,
  Megaphone,
  ShoppingCart,
  GraduationCap,
  Feather,
  BookOpen,
  Share2,
  Mail,
  Search,
  Image,
  Volume2,
  ListChecks,
  Home,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { promptCategories, getPromptsByCategory } from "@/lib/prompts/prompt-library";

const plans = [
  {
    name: "Brezplačno",
    price: "0",
    desc: "Za vedno brezplačno",
    popular: false,
    features: [
      "2.000 besed",
      "10 slik",
      "AI Chat, Besedila, Dokumenti",
      "3 predloge za besedila",
      "AI Prevajalnik (3 jeziki)",
      "5 generiranj zvoka",
      "10 analiz slik (OCR)",
      "E-poštna podpora",
    ],
    cta: "Začnite brezplačno",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Osnovno",
    price: "16,90",
    desc: "Za posameznike in študente",
    popular: false,
    features: [
      "20.000 besed / mesec",
      "200 slik / mesec",
      "AI Chat, Besedila, Dokumenti",
      "15 predlog za besedila",
      "AI Prevajalnik (40+ jezikov)",
      "50 generiranj zvoka",
      "100 analiz slik (OCR)",
      "E-poštna podpora",
    ],
    cta: "Izberite paket",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Profesionalno",
    price: "39,90",
    desc: "Za profesionalce in ekipe",
    popular: true,
    features: [
      "50.000 besed / mesec",
      "400 slik / mesec",
      "Vse funkcije vključene",
      "Vse predloge za besedila",
      "Najzmogljivejši AI model (Opus)",
      "150 generiranj zvoka",
      "400 analiz slik (OCR)",
      "80 inpainting urejanj",
      "100 dokumentov v AI Spominu",
      "Prednostna podpora",
    ],
    cta: "Izberite paket",
    ctaStyle: "cta-button",
  },
  {
    name: "Poslovno",
    price: "84,90",
    desc: "Za velika podjetja in organizacije",
    popular: false,
    features: [
      "150.000 besed / mesec",
      "800 slik / mesec",
      "Vse funkcije — vrhunska kakovost",
      "Najzmogljivejši AI model (Opus)",
      "400 generiranj zvoka",
      "800 analiz slik (OCR)",
      "250 inpainting urejanj",
      "250 dokumentov v AI Spominu",
      "API dostop",
      "Telefonska podpora",
    ],
    cta: "Izberite paket",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
];

const useCases: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: GraduationCap,
    title: "Študenti in dijaki",
    desc: "Povzetki učbenikov, kartice za izpite, eseji, seminarske naloge — vse v brezhibni slovenščini.",
  },
  {
    icon: Briefcase,
    title: "Zaposleni",
    desc: "E-maili, poročila, predstavitve, zapisniki sestankov — AI pomaga pri vsakodnevnih nalogah.",
  },
  {
    icon: TrendingUp,
    title: "Podjetniki",
    desc: "Marketinška besedila, opisi izdelkov, poslovni načrti — profesionalne vsebine brez agencije.",
  },
  {
    icon: BookOpen,
    title: "Učitelji in profesorji",
    desc: "Kvizi, preizkusi, poenostavitev gradiv za učence — priprava materialov v minutah.",
  },
  {
    icon: Megaphone,
    title: "Tržniki in agencije",
    desc: "Kampanje, oglasi, objave za družbena omrežja, grafike — 10x hitrejša produkcija vsebin.",
  },
  {
    icon: Feather,
    title: "Freelancerji in ustvarjalci",
    desc: "Blogi, prevodi, grafika za stranke — celoten kreativni studio na enem mestu.",
  },
];

const valueProps: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap, title: "10x hitrejše ustvarjanje", desc: "Besedilo, ki bi ga pisali uro, AI ustvari v 60 sekundah. Več časa za strategijo." },
  { icon: Globe, title: "Brezhibna slovenščina", desc: "Edina AI platforma, optimizirana za slovenski jezik. Naravna besedila brez tujk." },
  { icon: Shield, title: "Vaši podatki, vaša last", desc: "Generirane vsebine so vaša last. Podatkov ne delimo in ne treniramo AI z njimi." },
  { icon: Sparkles, title: "Za vsako nalogo", desc: "Od seminarskih in povzetkov do e-mailov in marketinških kampanj — AI pomaga pri vsakem besedilu." },
  { icon: Clock, title: "Na voljo 24/7", desc: "AI ne potrebuje odmora. Ustvarjajte vsebine kadarkoli — tudi ob 3. uri zjutraj." },
  { icon: GraduationCap, title: "Učite se hitreje", desc: "Ustvarite učne kartice, kvize in povzetke iz kateregakoli gradiva v nekaj sekundah." },
];

const howItWorks = [
  { step: "1", title: "Izberite orodje", desc: "Izberite med 13 AI orodji — od besedil do slik in zvoka." },
  { step: "2", title: "Vnesite navodila", desc: "Opišite, kaj potrebujete. V slovenščini, seveda." },
  { step: "3", title: "Pridobite rezultat", desc: "AI ustvari vsebino v sekundah. Uredite, kopirajte ali prenesite." },
];

const homepageIconMap: Record<string, LucideIcon> = {
  Briefcase,
  Megaphone,
  ShoppingCart,
  GraduationCap,
  Feather,
  Share2,
  Mail,
  Search,
  Image,
  Volume2,
  ListChecks,
  Home,
};

const testimonials = [
  {
    name: "Maja Kovač",
    role: "Vodja marketinga",
    company: "TerraVino d.o.o.",
    quote: "Končno AI, ki razume slovenščino! Opise izdelkov za spletno trgovino zdaj ustvarimo v minutah, ne urah. Kakovost besedil je presenetljivo dobra.",
  },
  {
    name: "Andrej Novak",
    role: "Študent prava",
    company: "Univerza v Ljubljani",
    quote: "Učne kartice in povzetki za izpite so mi rešili semester. Kar sem prej delal 4 ure, zdaj naredim v 20 minutah. Priporočam vsakemu študentu.",
  },
  {
    name: "Nina Zorko",
    role: "Samostojna podjetnica",
    company: "Zorko Design",
    quote: "Kot freelancerka potrebujem besedila za stranke vsak dan. 1984 mi prihrani vsaj 10 ur na teden — in besedila so boljša, kot bi jih napisala sama.",
  },
  {
    name: "Rok Marolt",
    role: "Direktor",
    company: "DigiPro Agency",
    quote: "Naša agencija je z 1984 podvojila produkcijo vsebin. AI Prevajalnik in AI Besedila sta postala nepogrešljiva orodja za celotno ekipo.",
  },
  {
    name: "Sara Oblak",
    role: "Profesorica slovenščine",
    company: "Gimnazija Celje",
    quote: "Gradiva za pouk pripravljam trikrat hitreje. Kvizi, povzetki, prilagojeni teksti za različne ravni — vse v brezhibni slovenščini. Odlično orodje.",
  },
  {
    name: "Tomaž Koren",
    role: "E-commerce vodja",
    company: "SportShop.si",
    quote: "Za 400+ izdelkov smo potrebovali opise v slovenščini. Z 1984 smo jih ustvarili v enem tednu namesto treh mesecev. Neprecenljivo za spletno trgovino.",
  },
];

const promptPreviewCategories = promptCategories.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "1984",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://www.1984.si",
            description:
              "Prva slovenska AI platforma za ustvarjanje vsebin. 13 AI orodij za besedila, slike, zvok in dokumente.",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "0",
              highPrice: "84.90",
              priceCurrency: "EUR",
              offerCount: 4,
            },
            inLanguage: "sl",
          }),
        }}
      />
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
              13 AI orodij.
              <br />
              <span className="logo-gradient">Ena aplikacija.</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-8 text-lg md:text-xl text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              Besedila, povzetki, učno gradivo, slike, prevodi, zvok — 13 AI
              orodij za študente, zaposlene in podjetnike.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registracija"
                className="cta-button px-8 py-3.5 rounded-full font-semibold text-base flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Preizkusite brezplačno
              </Link>
              <Link
                href="/funkcije"
                className="gradient-border-btn px-8 py-3.5 rounded-full font-semibold text-base text-[#E1E1E1]"
              >
                Oglejte si funkcije
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <p className="mt-6 text-sm text-[#E1E1E1]/30">
              Brezplačni paket — brez kreditne kartice
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== DASHBOARD PREVIEW ===================== */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <p className="text-center text-sm text-[#E1E1E1]/30 mb-6 uppercase tracking-widest font-medium">
              Pogled v aplikacijo
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <DashboardPreview />
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="text-center text-sm text-[#E1E1E1]/40 mt-6 max-w-lg mx-auto">
              13 AI orodij v enem intuitivnem vmesniku — od pogovorov in besedil do grafike, zvoka in analize slik.
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
                13 AI orodij
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Vse, kar potrebujete za
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

      {/* ===================== PROMPT LIBRARY ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
                Knjižnica predlog
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                120+ pripravljenih predlog
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="mt-4 text-[#E1E1E1]/50 max-w-xl mx-auto">
                Ne veste, kaj napisati? Izberite predlogo in začnite v sekundah.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promptPreviewCategories.map((cat, i) => {
              const Icon = homepageIconMap[cat.icon] || Sparkles;
              const prompts = getPromptsByCategory(cat.id);
              const example = prompts[0];
              return (
                <AnimateOnScroll key={cat.id} delay={i * 80}>
                  <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 accent-icon" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-[#E1E1E1]/30">
                          {prompts.length} predlog
                        </p>
                      </div>
                    </div>
                    {example && (
                      <p className="text-xs text-[#E1E1E1]/40 leading-relaxed line-clamp-2 flex-1">
                        &ldquo;{example.prompt}&rdquo;
                      </p>
                    )}
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          <AnimateOnScroll delay={400}>
            <div className="mt-10 text-center">
              <Link
                href="/registracija"
                className="cta-button px-8 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Preizkusite brezplačno
              </Link>
            </div>
          </AnimateOnScroll>
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
                Namesto plačevanja 7 različnih orodij, dobite vse v eni
                aplikaciji — prilagojeno za slovenščino.
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
                  { name: "Quizlet Plus", what: "Učne kartice in kvizi", price: "8" },
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
                      &euro;90/mesec
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs accent-gradient uppercase tracking-wider font-semibold">
                      1984 Profesionalno
                    </p>
                    <p className="mt-1 text-4xl font-bold text-white">
                      &euro;39,90
                      <span className="text-sm font-normal text-[#E1E1E1]/40">
                        /mesec
                      </span>
                    </p>
                    <p className="mt-1 text-sm accent-gradient font-semibold">
                      Prihranite ~&euro;50 na mesec
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
                  Preizkusite brezplačno
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
                  <item.icon className="w-8 h-8 accent-icon mb-4" />
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

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
                Mnenja uporabnikov
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
                Kaj pravijo naši uporabniki?
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimateOnScroll key={t.name} delay={i * 80}>
                <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#FEB089] text-[#FEB089]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#E1E1E1]/70 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#E1E1E1]/40">{t.role}, {t.company}</p>
                  </div>
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
                Začnite z brezplačnim paketom. Nadgradite kadarkoli. Brez vezave.
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
              13 orodij za študij, delo in poslovanje. 120+ predlog, vse v slovenščini.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="mt-10">
              <Link
                href="/registracija"
                className="cta-button px-10 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Preizkusite 1984 brezplačno
              </Link>
              <p className="mt-4 text-sm text-[#E1E1E1]/30">
                Brezplačni paket — brez kreditne kartice — odpoved kadarkoli
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
