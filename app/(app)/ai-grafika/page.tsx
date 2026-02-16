"use client";

import { useState, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Download,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  X,
} from "lucide-react";

type GeneratedImage = {
  id: string;
  prompt: string;
  revised_prompt: string;
  image_url: string;
  size: string;
  style: string;
  quality: string;
  created_at: string;
};

const sizes = [
  { value: "1024x1024", label: "Kvadrat (1024×1024)" },
  { value: "1024x1792", label: "Pokončno (1024×1792)" },
  { value: "1792x1024", label: "Ležeče (1792×1024)" },
];

const styles = [
  { value: "vivid", label: "Živo" },
  { value: "natural", label: "Naravno" },
];

const qualities = [
  { value: "standard", label: "Standardno" },
  { value: "hd", label: "HD" },
];

function GrafikaPageInner() {
  const searchParams = useSearchParams();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("vivid");
  const [quality, setQuality] = useState("standard");
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  // Pre-fill from ?prompt= query param
  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) setPrompt(promptParam);
  }, [searchParams]);

  async function loadImages() {
    setLoadingImages(true);
    try {
      const res = await fetch("/api/ai/image");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch {
      // silent
    }
    setLoadingImages(false);
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, style, quality }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Napaka pri generiranju slike");
        setGenerating(false);
        return;
      }

      setImages((prev) => [data, ...prev]);
      setPrompt("");
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setGenerating(false);
  }

  async function handleDownload(img: GeneratedImage) {
    try {
      const res = await fetch(img.image_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `1984-${img.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(img.image_url, "_blank");
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">AI Grafika</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Opišite sliko in jo ustvarite z umetno inteligenco
      </p>

      {/* Generation form */}
      <form
        onSubmit={handleGenerate}
        className="mt-8 glass-card rounded-xl p-6"
      >
        <div className="space-y-4">
          {/* Prompt */}
          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Opis slike <span className="text-[#FEB089]">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="npr. Moderna pisarna s pogledom na Alpe, minimalistično oblikovanje, topla svetloba..."
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
            />
          </div>

          {/* Options row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Size */}
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Velikost
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
              >
                {sizes.map((s) => (
                  <option
                    key={s.value}
                    value={s.value}
                    className="bg-[#191919] text-[#E1E1E1]"
                  >
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Slog
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
              >
                {styles.map((s) => (
                  <option
                    key={s.value}
                    value={s.value}
                    className="bg-[#191919] text-[#E1E1E1]"
                  >
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Kakovost
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
              >
                {qualities.map((q) => (
                  <option
                    key={q.value}
                    value={q.value}
                    className="bg-[#191919] text-[#E1E1E1]"
                  >
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={generating}
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generating ? "Generiram sliko..." : "Generiraj sliko"}
          </button>
        </div>
      </form>

      {/* Gallery */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white mb-4">Galerija</h2>

        {loadingImages ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-[#FEB089]/40" />
            </div>
            <p className="text-sm text-[#E1E1E1]/30">
              Še niste ustvarili nobene slike. Opišite željeno sliko zgoraj in
              pritisnite &quot;Generiraj sliko&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="glass-card rounded-xl overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-white/[0.02]">
                  <img
                    src={img.image_url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setLightbox(img)}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                      title="Povečaj"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(img)}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                      title="Prenesi"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-[#E1E1E1]/70 line-clamp-2">
                    {img.prompt}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#E1E1E1]/30">
                    <span>{img.size}</span>
                    <span>·</span>
                    <span>
                      {img.style === "vivid" ? "Živo" : "Naravno"}
                    </span>
                    <span>·</span>
                    <span>
                      {img.quality === "hd" ? "HD" : "Standardno"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 p-2 rounded-lg text-white/60 hover:text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightbox.image_url}
              alt={lightbox.prompt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-[#E1E1E1]/60 flex-1 mr-4">
                {lightbox.prompt}
              </p>
              <button
                onClick={() => handleDownload(lightbox)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                Prenesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrafikaPage() {
  return (
    <Suspense>
      <GrafikaPageInner />
    </Suspense>
  );
}
