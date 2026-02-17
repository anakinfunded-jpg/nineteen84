"use client";

import { useState, useRef, type FormEvent, type DragEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Upload,
  BookOpenText,
  Copy,
  Check,
  X,
  FileText,
  Type,
} from "lucide-react";

type InputMode = "file" | "text";
type SummaryMode = "short" | "medium" | "detailed" | "bullets";

const SUMMARY_MODES: { id: SummaryMode; label: string; desc: string }[] = [
  { id: "short", label: "Kratko", desc: "~150 besed" },
  { id: "medium", label: "Srednje", desc: "~400 besed" },
  { id: "detailed", label: "Podrobno", desc: "~800 besed" },
  { id: "bullets", label: "Ključne točke", desc: "Alineje" },
];

const ACCEPTED_TYPES = ".pdf,.docx,.pptx,.xlsx,.txt,.md";

export default function PovzetekPage() {
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [summaryMode, setSummaryMode] = useState<SummaryMode>("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.size > 4 * 1024 * 1024) {
      setError("Datoteka je prevelika. Največja velikost je 4 MB.");
      return;
    }
    setFile(f);
    setError("");
    setOutput("");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setOutput("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (inputMode === "file" && !file) return;
    if (inputMode === "text" && !text.trim()) return;

    setLoading(true);
    setError("");
    setOutput("");

    try {
      let res: Response;

      if (inputMode === "file" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", summaryMode);
        res = await fetch("/api/ai/summarize", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: summaryMode }),
        });
      }

      if (!res.ok) {
        const errText = await res.text();
        setError(errText || "Napaka pri ustvarjanju povzetka");
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
        setOutput(accumulated);
      }
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">AI Povzetek</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Naložite dokument ali prilepite besedilo za takojšen povzetek
      </p>

      {/* Summary mode selector */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSummaryMode(m.id)}
            className={`p-3 rounded-xl text-left transition-all duration-200 ${
              summaryMode === m.id
                ? "bg-[#FEB089]/10 border border-[#FEB089]/30 text-white"
                : "glass-card text-[#E1E1E1]/60 hover:text-white"
            }`}
          >
            <p className="text-sm font-medium">{m.label}</p>
            <p className="text-xs mt-0.5 opacity-60">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input */}
        <div className="space-y-4">
          {/* Tab toggle */}
          <div className="glass-card rounded-xl p-1 inline-flex">
            <button
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
              onClick={() => inputRef.current?.click()}
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
                    PDF, DOCX, PPTX, XLSX, TXT, MD — do 4 MB
                  </p>
                </>
              )}
              <input
                ref={inputRef}
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
                Izvorno besedilo
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Prilepite besedilo, ki ga želite povzeti..."
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
              />
              <div className="mt-2">
                <span className="text-xs text-[#E1E1E1]/30">
                  {wordCount} besed
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              (inputMode === "file" && !file) ||
              (inputMode === "text" && !text.trim())
            }
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BookOpenText className="w-4 h-4" />
            )}
            {loading ? "Ustvarjam povzetek..." : "Ustvari povzetek"}
          </button>
        </div>

        {/* Right: Output */}
        <div className="glass-card rounded-xl p-5 min-h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-[#E1E1E1]/60">Povzetek</label>
            {output && (
              <button
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
          <div className="flex-1 w-full min-h-[336px] px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm">
            {loading && !output && (
              <div className="flex items-center gap-2 text-[#E1E1E1]/30">
                <Loader2 className="w-4 h-4 animate-spin" />
                Ustvarjam povzetek...
              </div>
            )}
            {output ? (
              <div className="prose-chat leading-relaxed">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              !loading && (
                <span className="text-[#E1E1E1]/20">
                  Povzetek se bo prikazal tukaj...
                </span>
              )
            )}
          </div>
          {output && (
            <div className="mt-2">
              <span className="text-xs text-[#E1E1E1]/30">
                {output.trim().split(/\s+/).filter(Boolean).length} besed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
