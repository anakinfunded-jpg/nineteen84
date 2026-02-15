import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  MessageSquare,
  FileText,
  Image as ImageIcon,
  FilePenLine,
  Languages,
  Headphones,
  Check,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    desc: "Pogovarjajte se z AI v naravni slovenščini",
  },
  {
    icon: FileText,
    title: "AI Besedila",
    desc: "40+ predlog za marketinška besedila",
  },
  {
    icon: ImageIcon,
    title: "AI Grafika",
    desc: "Generirajte profesionalne slike",
  },
  {
    icon: FilePenLine,
    title: "AI Dokumenti",
    desc: "Urejajte in izboljšajte dokumente",
  },
  {
    icon: Languages,
    title: "AI Prevajalnik",
    desc: "Prevajajte med 6 jeziki",
  },
  {
    icon: Headphones,
    title: "AI Zvok",
    desc: "Pretvorite besedilo v govor",
  },
];

const plans = [
  {
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
    name: "Profesionalno",
    price: "24,90",
    popular: true,
    features: [
      "50.000 besed",
      "500 slik",
      "Vse predloge",
      "Visoka kakovost",
      "Prednostna podpora",
    ],
  },
  {
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

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Produkt: [
    { label: "Funkcije", href: "#funkcije" },
    { label: "Cenik", href: "#cenik" },
    { label: "Blog", href: "/blog" },
  ],
  Podjetje: [
    { label: "O nas", href: "#o-nas" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Kariere", href: "/kariere" },
  ],
  Pravno: [
    { label: "Pogoji uporabe", href: "/pogoji" },
    { label: "Zasebnost", href: "/zasebnost" },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#171717] text-[#E1E1E1]">
      {/* ===================== NAVBAR ===================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#191919]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-serif tracking-[0.01em] logo-gradient"
          >
            1984
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="#funkcije"
              className="text-[#E1E1E1]/60 hover:text-white transition-colors duration-200"
            >
              Funkcije
            </Link>
            <Link
              href="#cenik"
              className="text-[#E1E1E1]/60 hover:text-white transition-colors duration-200"
            >
              Cenik
            </Link>
            <Link
              href="#o-nas"
              className="text-[#E1E1E1]/60 hover:text-white transition-colors duration-200"
            >
              O nas
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/prijava"
              className="text-sm text-[#E1E1E1]/60 hover:text-white transition-colors duration-200 hidden sm:block"
            >
              Prijava
            </Link>
            <Link
              href="/registracija"
              className="cta-button text-sm px-5 py-2.5 rounded-full font-semibold"
            >
              Začni brezplačno
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[900px] h-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(254,176,137,0.04), transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
              AI platforma za slovenščino
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-serif tracking-[0.01em] leading-[1.1]">
              Veliki brat
              <br />
              za vaša besedila.
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-8 text-lg md:text-xl text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              Prva slovenska AI aplikacija za ustvarjanje marketinških vsebin.
              Opisi izdelkov, objave za družbena omrežja, e-maili, blogi — vse v
              brezhibni slovenščini.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registracija"
                className="cta-button px-8 py-3.5 rounded-full font-semibold text-base"
              >
                Preizkusi brezplačno
              </Link>
              <Link
                href="#funkcije"
                className="gradient-border-btn px-8 py-3.5 rounded-full font-semibold text-base text-[#E1E1E1]"
              >
                Poglej funkcije
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="funkcije" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AnimateOnScroll>
              <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
                Funkcije
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

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimateOnScroll key={feature.title} delay={i * 80}>
                <div className="glass-card group p-6 rounded-2xl hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-5 group-hover:bg-white/[0.06] transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-[#FEB089]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#E1E1E1]/50 leading-relaxed">
                    {feature.desc}
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

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-3 text-sm text-[#E1E1E1]/70"
                      >
                        <Check className="w-4 h-4 text-[#FEB089] shrink-0" />
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

          <AnimateOnScroll delay={400}>
            <p className="mt-10 text-center text-sm text-[#E1E1E1]/40">
              Vsi paketi vključujejo 5-dnevno brezplačno preizkusno obdobje.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/[0.06] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="text-3xl font-serif tracking-[0.01em] logo-gradient inline-block"
              >
                1984
              </Link>
              <p className="mt-4 text-[#E1E1E1]/40 text-sm">
                AI, ki piše slovensko.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-4">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-sm text-[#E1E1E1]/30">
              © 2026 1984. Vse pravice pridržane.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
