"use client";

import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Languages,
  Copy,
  Check,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";

const languageGroups = [
  {
    label: "Pogosti",
    languages: [
      { code: "sl", label: "Slovenščina" },
      { code: "en", label: "Angleščina" },
      { code: "de", label: "Nemščina" },
      { code: "it", label: "Italijanščina" },
      { code: "hr", label: "Hrvaščina" },
      { code: "sr", label: "Srbščina" },
    ],
  },
  {
    label: "Balkanski",
    languages: [
      { code: "bs", label: "Bosanščina" },
      { code: "mk", label: "Makedonščina" },
      { code: "bg", label: "Bolgarščina" },
      { code: "sq", label: "Albanščina" },
      { code: "ro", label: "Romunščina" },
      { code: "el", label: "Grščina" },
      { code: "tr", label: "Turščina" },
    ],
  },
  {
    label: "Zahodni",
    languages: [
      { code: "fr", label: "Francoščina" },
      { code: "es", label: "Španščina" },
      { code: "pt", label: "Portugalščina" },
      { code: "nl", label: "Nizozemščina" },
      { code: "ga", label: "Irščina" },
    ],
  },
  {
    label: "Srednjeevropski",
    languages: [
      { code: "hu", label: "Madžarščina" },
      { code: "at", label: "Avstrijska nemščina" },
      { code: "pl", label: "Poljščina" },
      { code: "cs", label: "Češčina" },
      { code: "sk", label: "Slovaščina" },
    ],
  },
  {
    label: "Skandinavski",
    languages: [
      { code: "da", label: "Danščina" },
      { code: "sv", label: "Švedščina" },
      { code: "no", label: "Norveščina" },
      { code: "fi", label: "Finščina" },
      { code: "is", label: "Islandščina" },
    ],
  },
  {
    label: "Vzhodni",
    languages: [
      { code: "uk", label: "Ukrajinščina" },
      { code: "ru", label: "Ruščina" },
      { code: "lt", label: "Litovščina" },
      { code: "lv", label: "Latvijščina" },
      { code: "et", label: "Estonščina" },
      { code: "ka", label: "Gruzijščina" },
    ],
  },
  {
    label: "Azijski",
    languages: [
      { code: "zh", label: "Kitajščina" },
      { code: "ja", label: "Japonščina" },
      { code: "ko", label: "Korejščina" },
      { code: "hi", label: "Hindijščina" },
      { code: "ar", label: "Arabščina" },
      { code: "he", label: "Hebrejščina" },
      { code: "th", label: "Tajščina" },
      { code: "vi", label: "Vietnamščina" },
      { code: "id", label: "Indonezijščina" },
      { code: "ms", label: "Malajščina" },
    ],
  },
  {
    label: "Ostalo",
    languages: [
      { code: "sw", label: "Svahili" },
      { code: "la", label: "Latinščina" },
    ],
  },
];

const allLanguages = languageGroups.flatMap((g) => g.languages);

export default function PrevajalnikPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [sourceLang, setSourceLang] = useState("sl");
  const [targetLang, setTargetLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function swapLanguages() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(result);
    setResult(text);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;

    if (sourceLang === targetLang) {
      setError("Izvorni in ciljni jezik morata biti različna");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(errText || "Napaka pri prevajanju");
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
      <h1 className="text-2xl font-semibold text-white">AI Prevajalnik</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Prevajajte besedila med 40+ jeziki z umetno inteligenco
      </p>

      {/* Language selector */}
      <div className="mt-8 flex items-center gap-3">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
        >
          {languageGroups.map((group) => (
            <optgroup
              key={group.label}
              label={group.label}
              className="bg-[#191919] text-[#E1E1E1]/50"
            >
              {group.languages.map((l) => (
                <option
                  key={l.code}
                  value={l.code}
                  className="bg-[#191919] text-[#E1E1E1]"
                >
                  {l.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          type="button"
          onClick={swapLanguages}
          className="p-3 rounded-xl glass-card hover:bg-white/[0.06] text-[#E1E1E1]/60 hover:text-[#FEB089] transition-all duration-200 shrink-0"
          title="Zamenjaj jezike"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
        >
          {languageGroups.map((group) => (
            <optgroup
              key={group.label}
              label={group.label}
              className="bg-[#191919] text-[#E1E1E1]/50"
            >
              {group.languages.map((l) => (
                <option
                  key={l.code}
                  value={l.code}
                  className="bg-[#191919] text-[#E1E1E1]"
                >
                  {l.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Input / Output */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Source text */}
          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm text-[#E1E1E1]/60 mb-2">
              {allLanguages.find((l) => l.code === sourceLang)?.label || "Izvorno besedilo"}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Vnesite besedilo za prevod..."
              required
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
            />
            <div className="mt-2">
              <span className="text-xs text-[#E1E1E1]/30">
                {text.trim().split(/\s+/).filter(Boolean).length} besed
              </span>
            </div>
          </div>

          {/* Translation result */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-[#E1E1E1]/60">
                {allLanguages.find((l) => l.code === targetLang)?.label || "Prevod"}
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
            <div className="w-full min-h-[288px] px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm">
              {loading && !result && (
                <div className="flex items-center gap-2 text-[#E1E1E1]/30">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Prevajam...
                </div>
              )}
              {result ? (
                <div className="prose-chat leading-relaxed">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (!loading && (
                <span className="text-[#E1E1E1]/20">
                  Prevod se bo prikazal tukaj...
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
          disabled={loading || !text.trim() || sourceLang === targetLang}
          className="mt-4 w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? "Prevajam..." : "Prevedi"}
        </button>
      </form>
    </div>
  );
}
