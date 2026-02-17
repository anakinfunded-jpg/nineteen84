"use client";

import { useState, useRef, useEffect, type FormEvent, type DragEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Languages,
  Copy,
  Check,
  ArrowLeftRight,
  Sparkles,
  Upload,
  Type,
  FileText,
  X,
} from "lucide-react";

type InputMode = "file" | "text";

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

const ACCEPTED_TYPES = ".pdf,.docx,.pptx,.xlsx,.txt,.md";

function PrevajalnikPageInner() {
  const searchParams = useSearchParams();
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [sourceLang, setSourceLang] = useState("sl");
  const [targetLang, setTargetLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill from ?prompt= query param
  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) {
      setText(promptParam);
      setInputMode("text");
    }
  }, [searchParams]);

  function handleFile(f: File) {
    if (f.size > 20 * 1024 * 1024) {
      setError("Datoteka je prevelika. Največja velikost je 20 MB.");
      return;
    }
    setFile(f);
    setError("");
    setResult("");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setResult("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function swapLanguages() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (inputMode === "text") {
      setText(result);
      setResult(text);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (inputMode === "file" && !file) return;
    if (inputMode === "text" && !text.trim()) return;

    if (sourceLang === targetLang) {
      setError("Izvorni in ciljni jezik morata biti različna");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      let res: Response;

      if (inputMode === "file" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceLang", sourceLang);
        formData.append("targetLang", targetLang);
        res = await fetch("/api/ai/translate", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, sourceLang, targetLang }),
        });
      }

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
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">AI Prevajalnik</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Naložite dokument ali prilepite besedilo za prevod med 40+ jeziki
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
          {/* Source */}
          <div className="space-y-4">
            {/* Tab toggle */}
            <div className="glass-card rounded-xl p-1 inline-flex">
              <button
                type="button"
                onClick={() => setInputMode("file")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  inputMode === "file"
                    ? "bg-white/[0.08] text-white"
                    : "text-[#E1E1E1]/50 hover:text-[#E1E1E1]"
                }`}
              >
                <Upload className="w-4 h-4" />
                Datoteka
              </button>
              <button
                type="button"
                onClick={() => setInputMode("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  inputMode === "text"
                    ? "bg-white/[0.08] text-white"
                    : "text-[#E1E1E1]/50 hover:text-[#E1E1E1]"
                }`}
              >
                <Type className="w-4 h-4" />
                Besedilo
              </button>
            </div>

            {inputMode === "file" ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`glass-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition-colors duration-200 ${
                  dragging ? "border-[#FEB089]/50 bg-white/[0.04]" : ""
                }`}
              >
                {file ? (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-[#FEB089]/50" />
                    </div>
                    <p className="text-sm text-[#E1E1E1]">{file.name}</p>
                    <p className="text-xs text-[#E1E1E1]/30 mt-1">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-red-400 bg-white/[0.04] hover:bg-white/[0.06] transition-colors mx-auto"
                    >
                      <X className="w-3.5 h-3.5" />
                      Odstrani
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                      <Upload className="w-7 h-7 text-[#FEB089]/50" />
                    </div>
                    <p className="text-sm text-[#E1E1E1]/50 text-center">
                      Povlecite datoteko sem ali kliknite za nalaganje
                    </p>
                    <p className="text-xs text-[#E1E1E1]/30 mt-1">
                      PDF, DOCX, PPTX, XLSX, TXT, MD — do 20 MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="glass-card rounded-xl p-5">
                <label className="block text-sm text-[#E1E1E1]/60 mb-2">
                  {allLanguages.find((l) => l.code === sourceLang)?.label ||
                    "Izvorno besedilo"}
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
            )}
          </div>

          {/* Translation result */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-[#E1E1E1]/60">
                {allLanguages.find((l) => l.code === targetLang)?.label ||
                  "Prevod"}
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
            <div className="w-full min-h-[280px] px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm">
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
              ) : (
                !loading && (
                  <span className="text-[#E1E1E1]/20">
                    Prevod se bo prikazal tukaj...
                  </span>
                )
              )}
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
          disabled={
            loading ||
            sourceLang === targetLang ||
            (inputMode === "file" && !file) ||
            (inputMode === "text" && !text.trim())
          }
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

export default function PrevajalnikPage() {
  return (
    <Suspense>
      <PrevajalnikPageInner />
    </Suspense>
  );
}
