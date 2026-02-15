"use client";

import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || sending) return;

    setSending(true);
    // [TODO] Wire up to actual contact form API (e.g. Resend)
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
              Kontakt
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              Pišite nam.
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-xl mx-auto">
              Imate vprašanje, predlog ali potrebujete pomoč? Z veseljem vam
              odgovorimo.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
          {/* Info */}
          <div className="space-y-6">
            <AnimateOnScroll>
              <div className="glass-card rounded-2xl p-6">
                <Mail className="w-6 h-6 text-[#FEB089] mb-3" />
                <h3 className="text-base font-semibold text-white">E-pošta</h3>
                <a
                  href="mailto:info@1984.si"
                  className="text-sm text-[#FEB089] hover:underline mt-1 inline-block"
                >
                  info@1984.si
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="glass-card rounded-2xl p-6">
                <Clock className="w-6 h-6 text-[#FEB089] mb-3" />
                <h3 className="text-base font-semibold text-white">
                  Odzivni čas
                </h3>
                <p className="text-sm text-[#E1E1E1]/50 mt-1">
                  Odgovorimo v roku 1 delovnega dne.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="glass-card rounded-2xl p-6">
                <MapPin className="w-6 h-6 text-[#FEB089] mb-3" />
                <h3 className="text-base font-semibold text-white">Naslov</h3>
                <p className="text-sm text-[#E1E1E1]/50 mt-1">
                  Grobelno del 151
                  <br />
                  3231 Grobelno
                  <br />
                  Slovenija
                </p>
                <p className="text-xs text-[#E1E1E1]/30 mt-2">
                  DŠ: 68174390
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Form */}
          <AnimateOnScroll delay={150}>
            <div className="glass-card rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl cta-gradient flex items-center justify-center mx-auto mb-6">
                    <Send className="w-7 h-7 text-[#171717]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Sporočilo poslano!
                  </h3>
                  <p className="mt-2 text-sm text-[#E1E1E1]/50">
                    Odgovorili vam bomo v najkrajšem možnem času.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      Ime in priimek <span className="text-[#FEB089]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
                      placeholder="Janez Novak"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      E-poštni naslov{" "}
                      <span className="text-[#FEB089]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
                      placeholder="janez@podjetje.si"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                      Sporočilo <span className="text-[#FEB089]">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors resize-none"
                      placeholder="Kako vam lahko pomagamo?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? "Pošiljam..." : "Pošlji sporočilo"}
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="py-16" />
    </>
  );
}
