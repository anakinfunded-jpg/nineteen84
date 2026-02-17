import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { blogPosts, getBlogPostBySlug } from "@/lib/marketing/blog-posts";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "404 | 1984" };

  return {
    title: `${post.title} | 1984 Blog`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazaj na blog
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll delay={50}>
            <span className="inline-block text-xs accent-gradient font-medium bg-[#FEB089]/10 px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="text-4xl md:text-5xl font-serif tracking-[0.01em] leading-[1.15] text-white">
              {post.title}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150}>
            <div className="mt-6 flex items-center gap-6 text-sm text-[#E1E1E1]/40">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readMin} min branja
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll delay={200}>
            <article className="prose prose-invert prose-sm max-w-none text-[#E1E1E1]/70 leading-relaxed [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-[#E1E1E1]/60 [&_strong]:text-[#E1E1E1]/90 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FEB089]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#E1E1E1]/50 [&_em]:text-[#E1E1E1]/60 [&_a]:text-[#FEB089] [&_a:hover]:underline [&_hr]:border-white/[0.06] [&_hr]:my-8">
              {post.content.split("\n\n").map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={i}>{trimmed.replace("## ", "")}</h2>
                  );
                }
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={i}>{trimmed.replace("### ", "")}</h3>
                  );
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const items = trimmed.split("\n").map((line) =>
                    line.replace(/^[-*]\s+/, "").trim()
                  );
                  return (
                    <ul key={i}>
                      {items.map((item, j) => (
                        <li key={j} dangerouslySetInnerHTML={{
                          __html: item
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                        }} />
                      ))}
                    </ul>
                  );
                }
                if (trimmed.startsWith("> ")) {
                  return (
                    <blockquote key={i} dangerouslySetInnerHTML={{
                      __html: trimmed.replace(/^>\s*/gm, "")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                    }} />
                  );
                }
                return (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: trimmed
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                  }} />
                );
              })}
            </article>
          </AnimateOnScroll>

          {/* CTA */}
          <AnimateOnScroll delay={100}>
            <div className="mt-16 glass-card rounded-2xl p-8 text-center">
              <h3 className="text-xl font-serif text-white">
                Preizkusite 1984 brezplačno
              </h3>
              <p className="mt-2 text-sm text-[#E1E1E1]/50">
                13 AI orodij za ustvarjanje vsebin v brezhibni slovenščini.
              </p>
              <Link
                href="/registracija"
                className="cta-button px-6 py-2.5 rounded-full font-semibold text-sm inline-block mt-5"
              >
                Začnite brezplačno
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
