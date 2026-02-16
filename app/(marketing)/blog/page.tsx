import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { blogPosts } from "@/lib/marketing/blog-posts";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | 1984 — AI, ki piše slovensko",
  description:
    "Nasveti, novosti in vodniki za uporabo AI pri ustvarjanju vsebin v slovenščini.",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block accent-gradient text-sm font-semibold tracking-widest uppercase">
              Blog
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              Nasveti, novosti
              <br />
              in <span className="logo-gradient">vodniki.</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto">
              Vse, kar morate vedeti o uporabi AI za ustvarjanje vsebin v
              slovenščini.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((post, i) => (
                <AnimateOnScroll key={post.slug} delay={i * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="glass-card group rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Image placeholder */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-white/[0.02] to-white/[0.05] flex items-center justify-center">
                      <span className="text-xs text-[#E1E1E1]/20">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs accent-gradient font-medium bg-[#FEB089]/10 px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>

                      <h2 className="text-base font-semibold text-white leading-snug group-hover:text-[#FEB089]/90 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#E1E1E1]/40 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs text-[#E1E1E1]/30">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readMin} min
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimateOnScroll>
            <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif text-white">
                Ostanite na tekočem
              </h2>
              <p className="mt-3 text-sm text-[#E1E1E1]/50">
                Prijavite se na naše e-novice za najnovejše nasvete in novosti
                o AI ustvarjanju vsebin.
              </p>
              <div className="mt-6">
                <NewsletterForm />
              </div>
              <p className="mt-3 text-xs text-[#E1E1E1]/20">
                Brez spama. Odjava kadarkoli.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
