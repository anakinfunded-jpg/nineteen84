"use client";

import { useState, useRef, type FormEvent } from "react";
import {
  Loader2,
  Upload,
  Paintbrush,
  Download,
  X,
  RotateCcw,
} from "lucide-react";

export default function InpaintingPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [brushSize, setBrushSize] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [painting, setPainting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const CANVAS_SIZE = 1024;

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Prosimo, naložite slikovno datoteko.");
      return;
    }
    setImageFile(f);
    setResult(null);
    setError("");

    const url = URL.createObjectURL(f);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      imageObjRef.current = img;
      drawImageToCanvas(img);
    };
    img.src = url;
  }

  function drawImageToCanvas(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    maskCanvas.width = CANVAS_SIZE;
    maskCanvas.height = CANVAS_SIZE;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Fit image to square canvas
    const scale = Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (CANVAS_SIZE - w) / 2;
    const y = (CANVAS_SIZE - h) / 2;

    ctx.drawImage(img, x, y, w, h);

    // Clear mask
    const maskCtx = maskCanvas.getContext("2d")!;
    maskCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  function getCanvasCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function paintAt(x: number, y: number) {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    // Draw on visible canvas (red overlay)
    const ctx = canvas.getContext("2d")!;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#FF4444";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw on mask canvas (white = area to edit)
    const maskCtx = maskCanvas.getContext("2d")!;
    maskCtx.fillStyle = "#FFFFFF";
    maskCtx.beginPath();
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    maskCtx.fill();
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setPainting(true);
    const { x, y } = getCanvasCoords(e);
    paintAt(x, y);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!painting) return;
    const { x, y } = getCanvasCoords(e);
    paintAt(x, y);
  }

  function handleMouseUp() {
    setPainting(false);
  }

  function clearMask() {
    if (imageObjRef.current) {
      drawImageToCanvas(imageObjRef.current);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!imageFile || !prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      // Export a CLEAN image (without the red paint overlay)
      const imgExportCanvas = document.createElement("canvas");
      imgExportCanvas.width = CANVAS_SIZE;
      imgExportCanvas.height = CANVAS_SIZE;
      const imgExportCtx = imgExportCanvas.getContext("2d")!;
      imgExportCtx.fillStyle = "#000";
      imgExportCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const img = imageObjRef.current!;
      const scale = Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const ox = (CANVAS_SIZE - w) / 2;
      const oy = (CANVAS_SIZE - h) / 2;
      imgExportCtx.drawImage(img, ox, oy, w, h);

      const imageBlob = await new Promise<Blob>((resolve) =>
        imgExportCanvas.toBlob((b) => resolve(b!), "image/png")
      );

      // Create mask: transparent where painted (white), opaque elsewhere
      // OpenAI expects: transparent = area to edit
      const maskExportCanvas = document.createElement("canvas");
      maskExportCanvas.width = CANVAS_SIZE;
      maskExportCanvas.height = CANVAS_SIZE;
      const maskExportCtx = maskExportCanvas.getContext("2d")!;

      // Fill with opaque black (areas to keep)
      maskExportCtx.fillStyle = "#000000";
      maskExportCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Get mask data to find painted areas
      const maskCtx = maskCanvas.getContext("2d")!;
      const maskData = maskCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const exportData = maskExportCtx.getImageData(
        0,
        0,
        CANVAS_SIZE,
        CANVAS_SIZE
      );

      // Where mask is white (painted), make transparent
      for (let i = 0; i < maskData.data.length; i += 4) {
        if (maskData.data[i] > 128) {
          exportData.data[i + 3] = 0; // transparent
        }
      }

      maskExportCtx.putImageData(exportData, 0, 0);

      const maskBlob = await new Promise<Blob>((resolve) =>
        maskExportCanvas.toBlob((b) => resolve(b!), "image/png")
      );

      const formData = new FormData();
      formData.append("image", new File([imageBlob], "image.png", { type: "image/png" }));
      formData.append("mask", new File([maskBlob], "mask.png", { type: "image/png" }));
      formData.append("prompt", prompt);

      const res = await fetch("/api/ai/inpainting", {
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
    a.download = `1984-inpaint-${Date.now()}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className="p-8 max-w-5xl relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragging && (
        <div className="absolute inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl pointer-events-none">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[#FEB089]/50">
            <Upload className="w-12 h-12 text-[#FEB089]" />
            <p className="text-lg text-[#FEB089] font-medium">
              Spustite sliko za nalaganje
            </p>
            <p className="text-sm text-[#E1E1E1]/40">
              PNG, JPG, WebP
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-white">AI Inpainting</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Označite del slike in opišite, kaj naj AI nariše namesto tega
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Canvas area */}
        <div className="space-y-4">
          {imageSrc ? (
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#E1E1E1]/60">
                  Označite območje za urejanje
                </p>
                <button
                  onClick={clearMask}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Počisti
                </button>
              </div>
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full aspect-square rounded-lg cursor-crosshair bg-black"
                style={{ imageRendering: "auto" }}
              />
              <canvas ref={maskCanvasRef} className="hidden" />
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              className="glass-card rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-[#FEB089]/40" />
              </div>
              <p className="text-sm text-[#E1E1E1]/50">
                Kliknite za nalaganje slike
              </p>
              <p className="text-xs text-[#E1E1E1]/30 mt-1">
                Slika bo prilagojena na 1024×1024
              </p>
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

          {/* Result */}
          {result && (
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#E1E1E1]/60">Rezultat</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Prenesi
                </button>
              </div>
              <img
                src={result}
                alt="Inpainting rezultat"
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Velikost čopiča: {brushSize}px
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-[#FEB089]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Kaj naj AI nariše? <span className="text-[#FEB089]">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="npr. Zelen gozd, modro nebo z oblaki..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!imageFile || !prompt.trim() || loading}
              className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Paintbrush className="w-4 h-4" />
              )}
              {loading ? "Urejam sliko..." : "Uredi sliko"}
            </button>
          </div>

          {imageSrc && (
            <button
              onClick={() => {
                setImageFile(null);
                setImageSrc(null);
                setResult(null);
                setError("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-4 h-4" />
              Nova slika
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
