"use client";

import { useState, useRef, type FormEvent, type DragEvent } from "react";
import {
  Loader2,
  Upload,
  Replace,
  Download,
  X,
  Search,
  ArrowRight,
} from "lucide-react";

export default function ZamenjavaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Prosimo, naložite slikovno datoteko.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
    setResult(null);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setFindText("");
    setReplaceText("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !findText.trim() || !replaceText.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("find", findText);
    formData.append("replace", replaceText);

    try {
      const res = await fetch("/api/ai/replace", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Napaka pri urejanju slike");
        setLoading(false);
        return;
      }

      setResult(data.image_url);
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `1984-zamenjava-${Date.now()}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-white">Najdi in spremeni</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Opišite, kaj želite najti na sliki in s čim zamenjati
      </p>

      <div className="mt-8 space-y-6">
        {/* Upload */}
        {!preview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`glass-card rounded-xl p-12 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-colors duration-200 ${
              dragging ? "border-[#FEB089]/50 bg-white/[0.04]" : ""
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[#FEB089]/40" />
            </div>
            <p className="text-sm text-[#E1E1E1]/50">
              Povlecite sliko sem ali kliknite za nalaganje
            </p>
            <p className="text-xs text-[#E1E1E1]/30 mt-1">
              JPG, PNG, WebP — do 4 MB
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-5 space-y-4">
            {/* Find & Replace inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                  <Search className="w-3.5 h-3.5 inline mr-1" />
                  Najdi <span className="text-[#FEB089]">*</span>
                </label>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder='npr. "rdeč avto"'
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
                />
              </div>
              <div className="hidden sm:flex items-center pb-1">
                <ArrowRight className="w-5 h-5 text-[#FEB089]/40" />
              </div>
              <div>
                <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                  <Replace className="w-3.5 h-3.5 inline mr-1" />
                  Spremeni v <span className="text-[#FEB089]">*</span>
                </label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder='npr. "moder avto"'
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={
                  !file || !findText.trim() || !replaceText.trim() || loading
                }
                className="flex-1 cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Replace className="w-4 h-4" />
                )}
                {loading ? "Spreminjam..." : "Spremeni"}
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-3 rounded-xl text-sm text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
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

        {/* Before / After comparison */}
        {(preview || result) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preview && (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06]">
                  <p className="text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Izvirnik
                  </p>
                </div>
                <img
                  src={preview}
                  alt="Izvirnik"
                  className="w-full aspect-square object-contain bg-black/30"
                />
              </div>
            )}

            {result && (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                  <p className="text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Rezultat
                  </p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-xs text-[#E1E1E1]/40 hover:text-[#E1E1E1] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Prenesi
                  </button>
                </div>
                <img
                  src={result}
                  alt="Rezultat"
                  className="w-full aspect-square object-contain bg-black/30"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
