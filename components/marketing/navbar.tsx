"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  FileText,
  Image as ImageIcon,
  FilePenLine,
  Languages,
  Volume2,
  Eye,
  Paintbrush,
  Replace,
  Brain,
  ArrowRightLeft,
  ChevronDown,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type FeatureLink = { label: string; href: string; icon: LucideIcon; desc: string };

const featureLinks: FeatureLink[] = [
  { label: "AI Chat", href: "/funkcije/ai-chat", icon: MessageSquare, desc: "Pogovor z AI v slovenščini" },
  { label: "AI Besedila", href: "/funkcije/ai-besedila", icon: FileText, desc: "40+ predlog za marketinška besedila" },
  { label: "AI Grafika", href: "/funkcije/ai-grafika", icon: ImageIcon, desc: "Ustvarjanje profesionalnih slik" },
  { label: "AI Dokumenti", href: "/funkcije/ai-dokumenti", icon: FilePenLine, desc: "Urejanje in izboljšanje dokumentov" },
  { label: "AI Prevajalnik", href: "/funkcije/ai-prevajalnik", icon: Languages, desc: "Prevajanje med 6 jeziki" },
  { label: "AI Zvok", href: "/funkcije/ai-zvok", icon: Volume2, desc: "Besedilo v govor in govor v besedilo" },
  { label: "Računalniški vid", href: "/funkcije/ai-vid", icon: Eye, desc: "Analiza slik in OCR" },
  { label: "AI Inpainting", href: "/funkcije/ai-inpainting", icon: Paintbrush, desc: "Urejanje delov slike z AI" },
  { label: "Najdi in spremeni", href: "/funkcije/ai-zamenjava", icon: Replace, desc: "Poišči in zamenjaj v slikah" },
  { label: "AI Spomin", href: "/funkcije/ai-spomin", icon: Brain, desc: "Baza znanja z dokumenti" },
  { label: "Pretvorniki", href: "/funkcije/pretvorniki", icon: ArrowRightLeft, desc: "Pretvorba med formati datotek" },
];

const navLinks = [
  { label: "Cenik", href: "/cenik" },
  { label: "Blog", href: "/blog" },
  { label: "O nas", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFeatures = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setFeaturesOpen(true);
  }, []);

  const closeFeatures = useCallback(() => {
    closeTimer.current = setTimeout(() => setFeaturesOpen(false), 150);
  }, []);

  useEffect(() => { return () => { if (closeTimer.current) clearTimeout(closeTimer.current); }; }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#191919]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-serif tracking-[0.01em] logo-gradient"
        >
          1984
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Features dropdown */}
          <div
            className="relative"
            onMouseEnter={openFeatures}
            onMouseLeave={closeFeatures}
          >
            <Link
              href="/funkcije"
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                pathname.startsWith("/funkcije")
                  ? "text-white"
                  : "text-[#E1E1E1]/60 hover:text-white"
              }`}
            >
              Funkcije
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`} />
            </Link>

            {/* Mega menu — outer wrapper is invisible bridge so hover doesn't break */}
            {featuresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] pt-2">
                <div className="p-4 bg-[#1a1a1a] border border-white/[0.06] rounded-2xl shadow-2xl">
                  <div className="grid grid-cols-2 gap-1">
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/[0.08] transition-colors">
                          <item.icon className="w-4 h-4 accent-icon" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.label}</p>
                          <p className="text-xs text-[#E1E1E1]/40 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <Link
                      href="/funkcije"
                      className="text-xs accent-gradient hover:opacity-80 transition-opacity"
                    >
                      Poglej vse funkcije →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                pathname === link.href
                  ? "text-white"
                  : "text-[#E1E1E1]/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#E1E1E1]/60 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#191919] border-t border-white/[0.06] px-6 py-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/funkcije"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-white font-medium rounded-lg"
            >
              Vse funkcije
            </Link>
            {featureLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#E1E1E1]/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <item.icon className="w-4 h-4 accent-icon" />
                {item.label}
              </Link>
            ))}
            <div className="my-3 border-t border-white/[0.06]" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-[#E1E1E1]/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-3 border-t border-white/[0.06]" />
            <Link
              href="/prijava"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-[#E1E1E1]/60 hover:text-white rounded-lg"
            >
              Prijava
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
