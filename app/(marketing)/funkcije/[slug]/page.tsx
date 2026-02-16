import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";
import { features, getFeatureBySlug } from "@/lib/marketing/features";
import { getPromptsByTool } from "@/lib/prompts/prompt-library";
import { Check, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const slugToTool: Record<string, string> = {
  "ai-chat": "ai-chat",
  "ai-besedila": "ai-besedila",
  "ai-dokumenti": "ai-dokumenti",
  "ai-prevajalnik": "ai-prevajalnik",
  "ai-grafika": "ai-grafika",
  "ai-zvok": "ai-zvok",
};

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return { title: "404 | 1984" };

  return {
    title: `${feature.title} | 1984 — AI, ki piše slovensko`,
    description: feature.heroDescription,
  };
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();

  // Get related features (same category, excluding current)
  const related = features
    .filter((f) => f.category === feature.category && f.slug !== feature.slug)
    .slice(0, 3);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
              <feature.icon className="w-4 h-4 accent-icon" />
              <span className="text-sm text-[#E1E1E1]/60">{feature.category}</span>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              {feature.heroTitle}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              {feature.heroDescription}
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
                href="#kako-deluje"
                className="gradient-border-btn px-8 py-3.5 rounded-full font-semibold text-base text-[#E1E1E1]"
              >
                Kako deluje
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===================== FEATURE SECTIONS ===================== */}
      <section id="kako-deluje" className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          {feature.sections.map((section, i) => (
            <div
              key={section.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Text */}
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <AnimateOnScroll>
                  <h2 className="text-3xl md:text-4xl font-serif tracking-[0.01em] leading-tight text-white">
                    {section.title}
                  </h2>
                </AnimateOnScroll>
                <AnimateOnScroll delay={100}>
                  <p className="mt-4 text-[#E1E1E1]/60 leading-relaxed">
                    {section.description}
                  </p>
                </AnimateOnScroll>
                <AnimateOnScroll delay={200}>
                  <ul className="mt-6 space-y-3">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-[#E1E1E1]/70"
                      >
                        <Check className="w-4 h-4 accent-icon shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </AnimateOnScroll>
              </div>

              {/* Dashboard mockup */}
              <div className={i % 2 === 1 ? "lg:col-start-1" : ""}>
                <AnimateOnScroll delay={150}>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    {section.screenshotKey ? (
                      <DashboardMockup screenshotKey={section.screenshotKey} />
                    ) : (
                      <div className="w-full h-full glass-card rounded-2xl bg-gradient-to-br from-white/[0.02] to-white/[0.04] flex items-center justify-center">
                        <feature.icon className="w-16 h-16 accent-icon opacity-10" />
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PROMPT SUGGESTIONS ===================== */}
      {slugToTool[slug] && getPromptsByTool(slugToTool[slug]).length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll>
              <h2 className="text-2xl font-serif text-white mb-2">
                Predloge za {feature.title}
              </h2>
              <p className="text-sm text-[#E1E1E1]/40 mb-8">
                Pripravljene predloge, ki jih lahko uporabite takoj
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getPromptsByTool(slugToTool[slug])
                .slice(0, 4)
                .map((prompt, i) => (
                  <AnimateOnScroll key={prompt.id} delay={i * 80}>
                    <div className="glass-card rounded-xl p-5 h-full flex flex-col">
                      <h3 className="text-sm font-semibold text-white mb-2">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-[#E1E1E1]/50 leading-relaxed line-clamp-3 flex-1">
                        {prompt.prompt}
                      </p>
                      <Link
                        href="/registracija"
                        className="mt-3 inline-flex items-center gap-1 text-xs accent-gradient font-medium"
                      >
                        Preizkusi <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </AnimateOnScroll>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== FAQ ===================== */}
      {feature.faq.length > 0 && (
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
              {feature.faq.map((item, i) => (
                <AnimateOnScroll key={i} delay={i * 50}>
                  <details className="glass-card rounded-xl group" open={i === 0}>
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
      )}

      {/* ===================== RELATED FEATURES ===================== */}
      {related.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll>
              <h2 className="text-2xl font-serif text-white mb-8">
                Sorodne funkcije
              </h2>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((f, i) => (
                <AnimateOnScroll key={f.slug} delay={i * 80}>
                  <Link
                    href={`/funkcije/${f.slug}`}
                    className="glass-card group rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                  >
                    <f.icon className="w-6 h-6 accent-icon mb-3" />
                    <h3 className="text-base font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#E1E1E1]/40 flex-1">
                      {f.shortDesc}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs accent-gradient">
                      Več <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-5xl font-serif tracking-[0.01em] leading-tight">
              Preizkusite{" "}
              <span className="logo-gradient">{feature.title}</span>
              <br />
              brezplačno.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="mt-6 text-lg text-[#E1E1E1]/50">
              Začnite v manj kot minuti — brez kreditne kartice.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/registracija"
              className="cta-button px-10 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2 mt-8"
            >
              <Sparkles className="w-5 h-5" />
              Začni brezplačno
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
