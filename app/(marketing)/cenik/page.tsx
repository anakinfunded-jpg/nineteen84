import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Check, Sparkles, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cenik | 1984 — AI, ki piše slovensko",
  description:
    "Preprosti in transparentni paketi za vsa vaša marketinška orodja AI. Začnite brezplačno, brez kreditne kartice.",
};

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
      "3 inpainting urejanja",
      "5 dokumentov v AI Spominu",
      "Pretvorba datotek",
      "E-poštna podpora",
    ],
    cta: "Začnite brezplačno",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Osnovno",
    price: "16,90",
    desc: "Za podjetnike in posameznike",
    popular: false,
    features: [
      "20.000 besed / mesec",
      "200 slik / mesec",
      "AI Chat, Besedila, Dokumenti",
      "15 predlog za besedila",
      "AI Prevajalnik (40+ jezikov)",
      "50 generiranj zvoka",
      "100 analiz slik (OCR)",
      "20 inpainting urejanj",
      "25 dokumentov v AI Spominu",
      "Pretvorba datotek",
      "E-poštna podpora",
    ],
    cta: "Izberite paket",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
  {
    name: "Profesionalno",
    price: "39,90",
    desc: "Za marketinške ekipe in agencije",
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
      "Najdi in spremeni v slikah",
      "Pretvorba datotek",
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
      "Najdi in spremeni v slikah",
      "Pretvorba datotek",
      "API dostop",
      "Telefonska podpora",
    ],
    cta: "Izberite paket",
    ctaStyle: "gradient-border-btn text-[#E1E1E1] hover:text-white",
  },
];

const faq = [
  {
    q: "Ali res lahko začnem brezplačno?",
    a: "Da! Brezplačni paket vključuje 2.000 besed in 10 slik vsak mesec. Kreditna kartica ni potrebna.",
  },
  {
    q: "Kako deluje obračunavanje?",
    a: "Naročnina se obračunava mesečno. Plačila varno obdeluje Stripe. Naročnino lahko kadarkoli prekličete v nastavitvah računa.",
  },
  {
    q: "Kaj se zgodi, ko porabim mesečno kvoto?",
    a: "Ko dosežete mesečno kvoto, boste obveščeni. Lahko nadgradite paket ali počakate do naslednjega meseca, ko se kvota ponastavi.",
  },
  {
    q: "Ali se neporabljene besede prenesejo v naslednji mesec?",
    a: "Ne, kvote se ponastavijo vsak mesec. Priporočamo, da izberete paket, ki ustreza Vašim dejanskim potrebam.",
  },
  {
    q: "Kakšna je razlika med AI modeli?",
    a: "Brezplačni in Osnovni paket uporabljata model Sonnet — hiter in zanesljiv. Profesionalni in Poslovni paket uporabljata najzmogljivejši model Opus, ki daje vrhunske rezultate primerljive s ChatGPT in Claude.",
  },
  {
    q: "Ali lahko kadarkoli prekličem naročnino?",
    a: "Da, naročnino lahko kadarkoli prekličete brez obveznosti. Dostop ohranite do konca obračunskega obdobja.",
  },
  {
    q: "Ali ponujate popust za letno plačilo?",
    a: "Letno plačilo z 20% popustom pripravljamo in bo na voljo kmalu. Prijavite se na e-novice, da Vas obvestimo.",
  },
];

export default function CenikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "Product",
                name: "1984 Osnovno",
                description: "AI platforma za posameznike — 20.000 besed in 200 slik mesečno",
                offers: { "@type": "Offer", price: "16.90", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: "https://www.1984.si/registracija" },
              },
              {
                "@type": "Product",
                name: "1984 Profesionalno",
                description: "AI platforma za ekipe — 50.000 besed in 400 slik mesečno z najzmogljivejšim AI modelom",
                offers: { "@type": "Offer", price: "39.90", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: "https://www.1984.si/registracija" },
              },
              {
                "@type": "Product",
                name: "1984 Poslovno",
                description: "AI platforma za podjetja — 150.000 besed, 800 slik mesečno, API dostop",
                offers: { "@type": "Offer", price: "84.90", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: "https://www.1984.si/registracija" },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
              Cenik
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              Preprosti paketi.
              <br />
              <span className="logo-gradient">Brez presenečenj.</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto">
              Izberite paket, ki ustreza Vašim potrebam. Nadgradite ali
              prekličite kadarkoli.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Plans */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
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

      {/* Compare note */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="glass-card rounded-2xl p-8 text-center">
              <HelpCircle className="w-8 h-8 accent-icon mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">
                Ne veste, kateri paket izbrati?
              </h3>
              <p className="mt-2 text-sm text-[#E1E1E1]/50 max-w-lg mx-auto">
                Začnite z brezplačnim paketom in ga kadarkoli nadgradite. Lahko
                nas tudi kontaktirate in z veseljem Vam pomagamo izbrati pravi
                paket.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/registracija"
                  className="cta-button px-6 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Preizkusite brezplačno
                </Link>
                <Link
                  href="/kontakt"
                  className="gradient-border-btn px-6 py-2.5 rounded-full font-semibold text-sm text-[#E1E1E1]"
                >
                  Kontaktirajte nas
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <AnimateOnScroll>
              <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] text-white">
                Pogosta vprašanja
              </h2>
            </AnimateOnScroll>
          </div>

          <div className="space-y-3">
            {faq.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 50}>
                <details
                  className="glass-card rounded-xl group"
                  open={i === 0}
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-white font-medium text-sm list-none">
                    {item.q}
                    <ChevronDown className="w-4 h-4 text-[#E1E1E1]/40 shrink-0 ml-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-[#E1E1E1]/60 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
              Preizkusite vse funkcije
              <br />
              <span className="logo-gradient">brezplačno.</span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="mt-6 text-lg text-[#E1E1E1]/50">
              Brez kreditne kartice. Brez vezave. Odpoved kadarkoli.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/registracija"
              className="cta-button px-10 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2 mt-8"
            >
              <Sparkles className="w-5 h-5" />
              Začnite brezplačno
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
