import Link from "next/link";

const productLinks = [
  { label: "AI Chat", href: "/funkcije/ai-chat" },
  { label: "AI Besedila", href: "/funkcije/ai-besedila" },
  { label: "AI Grafika", href: "/funkcije/ai-grafika" },
  { label: "AI Dokumenti", href: "/funkcije/ai-dokumenti" },
  { label: "AI Prevajalnik", href: "/funkcije/ai-prevajalnik" },
  { label: "AI Zvok", href: "/funkcije/ai-zvok" },
  { label: "Računalniški vid", href: "/funkcije/ai-vid" },
  { label: "AI Spomin", href: "/funkcije/ai-spomin" },
  { label: "AI Inpainting", href: "/funkcije/ai-inpainting" },
  { label: "Najdi in spremeni", href: "/funkcije/ai-zamenjava" },
  { label: "Pretvorniki", href: "/funkcije/pretvorniki" },
];

const companyLinks = [
  { label: "O nas", href: "/o-nas" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Cenik", href: "/cenik" },
  { label: "Partnerski program", href: "/affiliate" },
];

const legalLinks = [
  { label: "Pogoji uporabe", href: "/pogoji" },
  { label: "Politika zasebnosti", href: "/zasebnost" },
  { label: "Impressum", href: "/impressum" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-serif tracking-[0.01em] logo-gradient inline-block"
            >
              1984
            </Link>
            <p className="mt-4 text-[#E1E1E1]/40 text-sm max-w-xs leading-relaxed">
              Prva slovenska AI platforma za ustvarjanje marketinških vsebin.
              Besedila, slike, zvok in dokumenti — vse v brezhibni slovenščini.
            </p>
            <div className="mt-6">
              <Link
                href="/registracija"
                className="cta-button text-sm px-6 py-2.5 rounded-full font-semibold inline-block"
              >
                Začnite brezplačno
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Produkt</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
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

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Podjetje</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
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

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Pravno</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
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

            <h4 className="text-sm font-semibold text-white mb-4 mt-8">Kontakt</h4>
            <div className="space-y-1.5">
              <a
                href="mailto:info@1984.si"
                className="text-sm accent-gradient hover:opacity-80 transition-opacity block"
              >
                info@1984.si
              </a>
              <p className="text-xs text-[#E1E1E1]/30">
                Grobelno del 151, 3231 Grobelno
              </p>
              <p className="text-xs text-[#E1E1E1]/20">
                DŠ: 68174390
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#E1E1E1]/30">
            © 2026 1984. Vse pravice pridržane.
          </p>
          <p className="text-xs text-[#E1E1E1]/20">
            AI, ki piše slovensko.
          </p>
        </div>
      </div>
    </footer>
  );
}
