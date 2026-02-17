import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { features, categories } from "@/lib/marketing/features";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funkcije | 1984 — AI, ki piše slovensko",
  description:
    "13 AI orodij za ustvarjanje vsebin v slovenščini. Chat, besedila, slike, zvok, prevodi, dokumenti, povzetki, učno gradivo in več.",
};

export default function FunkcijePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
              Vse funkcije
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              13 AI orodij.
              <br />
              Ena platforma.
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto">
              Od marketinških besedil do slik, zvoka in analize dokumentov — vse, kar
              potrebujete za ustvarjanje profesionalnih vsebin v slovenščini.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features by category */}
      {categories.map((cat) => {
        const catFeatures = features.filter((f) => f.category === cat.name);
        if (catFeatures.length === 0) return null;

        return (
          <section key={cat.name} className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
                  <span
                    className="w-2 h-8 rounded-full"
                    style={{ background: cat.color }}
                  />
                  {cat.name}
                </h2>
              </AnimateOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catFeatures.map((feature, i) => (
                  <AnimateOnScroll key={feature.slug} delay={i * 80}>
                    <Link
                      href={`/funkcije/${feature.slug}`}
                      className="glass-card group rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] transition-all duration-300 h-full flex flex-col"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-5 group-hover:bg-white/[0.06] transition-colors duration-300">
                        <feature.icon className="w-6 h-6 accent-icon" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-[#E1E1E1]/50 leading-relaxed flex-1">
                        {feature.shortDesc}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm accent-gradient font-medium">
                        Več o {feature.title}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        );
      })}

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
              Začnite brezplačno — brez kreditne kartice.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/registracija"
              className="cta-button px-8 py-3.5 rounded-full font-semibold text-base inline-block mt-8"
            >
              Začni brezplačno
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
