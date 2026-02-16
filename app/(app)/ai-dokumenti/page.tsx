"use client";

import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  FilePenLine,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    id: "improve",
    label: "Izboljšaj",
    desc: "Izboljšaj berljivost in jasnost",
  },
  { id: "shorten", label: "Skrajšaj", desc: "Odstrani odvečne besede" },
  { id: "expand", label: "Razširi", desc: "Dodaj podrobnosti in primere" },
  {
    id: "formalize",
    label: "Formaliziraj",
    desc: "Pretvori v poslovni slog",
  },
  {
    id: "simplify",
    label: "Poenostavi",
    desc: "Uporabi enostavnejši jezik",
  },
  {
    id: "proofread",
    label: "Lektoriraj",
    desc: "Popravi slovnico in pravopis",
  },
];

export default function DokumentiPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [action, setAction] = useState("improve");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(errText || "Napaka pri obdelavi dokumenta");
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Napaka pri branju odgovora");
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">AI Dokumenti</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Izboljšajte, skrajšajte, razširite ali lektorirajte svoja besedila
      </p>

      {/* Action selector */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((a) => (
          <button
            key={a.id}
            onClick={() => setAction(a.id)}
            className={`p-3 rounded-xl text-left transition-all duration-200 ${
              action === a.id
                ? "bg-[#FEB089]/10 border border-[#FEB089]/30 text-white"
                : "glass-card text-[#E1E1E1]/60 hover:text-white"
            }`}
          >
            <p className="text-sm font-medium">{a.label}</p>
            <p className="text-xs mt-0.5 opacity-60">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Input / Output */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm text-[#E1E1E1]/60 mb-2">
              Izvorno besedilo
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Prilepite ali vnesite besedilo, ki ga želite obdelati..."
              required
              rows={14}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[#E1E1E1]/30">
                {text.trim().split(/\s+/).filter(Boolean).length} besed
              </span>
            </div>
          </div>

          {/* Output */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-[#E1E1E1]/60">
                Rezultat
              </label>
              {result && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-[#E1E1E1]/40 hover:text-[#FEB089] transition-colors duration-200"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Kopirano" : "Kopiraj"}
                </button>
              )}
            </div>
            <div className="w-full min-h-[336px] px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm">
              {loading && !result && (
                <div className="flex items-center gap-2 text-[#E1E1E1]/30">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Obdelujem besedilo...
                </div>
              )}
              {result ? (
                <div className="prose-chat leading-relaxed">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (!loading && (
                <span className="text-[#E1E1E1]/20">
                  Rezultat se bo prikazal tukaj...
                </span>
              ))}
            </div>
            {result && (
              <div className="mt-2">
                <span className="text-xs text-[#E1E1E1]/30">
                  {result.trim().split(/\s+/).filter(Boolean).length} besed
                </span>
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="mt-4 w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading
            ? "Obdelujem..."
            : `${actions.find((a) => a.id === action)?.label || "Obdelaj"} besedilo`}
        </button>
      </form>
    </div>
  );
}
