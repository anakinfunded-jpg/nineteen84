"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter naročnik",
          email,
          message: `Nova prijava na e-novice: ${email}`,
        }),
      });

      if (!res.ok) {
        setError("Napaka pri prijavi. Poskusite znova.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-sm text-green-400">
        <Check className="w-4 h-4" />
        Uspešno ste se prijavili na e-novice!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vaš@email.si"
          required
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="cta-button px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Prijavi se
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </form>
  );
}
