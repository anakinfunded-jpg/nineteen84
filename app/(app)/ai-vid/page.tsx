"use client";

import { useState, useRef, type FormEvent, type DragEvent } from "react";
import {
  Loader2,
  Upload,
  Eye,
  FileText,
  Copy,
  Check,
  X,
  ImageIcon,
} from "lucide-react";

type Mode = "describe" | "ocr";

export default function VisionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("describe");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Prosimo, naložite slikovno datoteko.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("Slika je prevelika. Največja velikost je 20 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
    setOutput("");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearImage() {
    setFile(null);
    setPreview(null);
    setOutput("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setOutput("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("mode", mode);

    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setOutput((prev) => prev + decoder.decode(value));
        }
      }
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Računalniški vid</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Naložite sliko in pridobite opis ali izvlecite besedilo
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Controls */}
        <div className="space-y-4">
          {/* Drop zone */}
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
            {preview ? (
              <div className="relative w-full">
                <img
                  src={preview}
                  alt="Predogled"
                  className="w-full max-h-[300px] object-contain rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 text-[#FEB089]/50" />
                </div>
                <p className="text-sm text-[#E1E1E1]/50 text-center">
                  Povlecite sliko sem ali kliknite za nalaganje
                </p>
                <p className="text-xs text-[#E1E1E1]/30 mt-1">
                  JPG, PNG, WebP, GIF — do 20 MB
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="hidden"
            />
          </div>

          {/* Mode selector */}
          <div className="glass-card rounded-xl p-4">
            <label className="block text-sm text-[#E1E1E1]/60 mb-2">
              Način delovanja
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("describe")}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                  mode === "describe"
                    ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
                    : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
                }`}
              >
                <Eye className="w-4 h-4" />
                Opiši sliko
              </button>
              <button
                type="button"
                onClick={() => setMode("ocr")}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                  mode === "ocr"
                    ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
                    : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
                }`}
              >
                <FileText className="w-4 h-4" />
                Izvleci besedilo
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {loading
              ? "Analiziram..."
              : mode === "describe"
              ? "Analiziraj sliko"
              : "Izvleci besedilo"}
          </button>
        </div>

        {/* Right: Output */}
        <div className="glass-card rounded-xl p-6 min-h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#E1E1E1]/60">
              {mode === "describe" ? "Opis slike" : "Izvlečeno besedilo"}
            </h2>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
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

          {output ? (
            <div className="flex-1 text-sm text-[#E1E1E1] leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <ImageIcon className="w-7 h-7 text-[#FEB089]/30" />
              </div>
              <p className="text-sm text-[#E1E1E1]/30">
                Naložite sliko in pritisnite
                &quot;Analiziraj&quot; za rezultat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
