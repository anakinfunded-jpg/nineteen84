"use client";

import { useState, useRef, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Volume2,
  Mic,
  Download,
  Copy,
  Check,
  Upload,
  Play,
  Square,
} from "lucide-react";

type Tab = "tts" | "stt";
type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

const voices: { value: Voice; label: string }[] = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

function ZvokPageInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("tts");
  const initialPrompt = searchParams.get("prompt") || "";

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">AI Zvok</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Pretvorite besedilo v govor ali govor v besedilo
      </p>

      {/* Tab selector */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab("tts")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
            tab === "tts"
              ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
              : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          Besedilo v govor
        </button>
        <button
          onClick={() => setTab("stt")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
            tab === "stt"
              ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
              : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
          }`}
        >
          <Mic className="w-4 h-4" />
          Govor v besedilo
        </button>
      </div>

      <div className="mt-6">
        {tab === "tts" ? <TTSTab initialText={initialPrompt} /> : <STTTab />}
      </div>
    </div>
  );
}

export default function ZvokPage() {
  return (
    <Suspense>
      <ZvokPageInner />
    </Suspense>
  );
}

function TTSTab({ initialText = "" }: { initialText?: string }) {
  const [text, setText] = useState(initialText);
  const [voice, setVoice] = useState<Voice>("alloy");
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Napaka pri generiranju zvoka");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `1984-zvok-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
            Besedilo <span className="text-[#FEB089]">*</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Vnesite besedilo, ki ga želite pretvoriti v govor..."
            required
            rows={5}
            maxLength={4096}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
          />
          <p className="mt-1 text-xs text-[#E1E1E1]/30 text-right">
            {text.length}/4096
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Glas
            </label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value as Voice)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
            >
              {voices.map((v) => (
                <option
                  key={v.value}
                  value={v.value}
                  className="bg-[#191919] text-[#E1E1E1]"
                >
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Hitrost: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.25"
              max="4.0"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full mt-2 accent-[#FEB089]"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          {loading ? "Generiram zvok..." : "Generiraj zvok"}
        </button>
      </div>

      {/* Audio player */}
      {audioUrl && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#E1E1E1]/60">
              Generiran zvok
            </h3>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Prenesi MP3
            </button>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full"
          />
        </div>
      )}
    </form>
  );
}

function STTTab() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function handleFile(f: File) {
    setFile(f);
    setError("");
    setResult("");
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const f = new File([blob], "recording.webm", { type: "audio/webm" });
        setFile(f);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      setError("Ni mogoče dostopati do mikrofona");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function handleTranscribe(e: FormEvent) {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setResult("");

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("language", "sl");

    try {
      const res = await fetch("/api/ai/stt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Napaka pri prepisovanju");
        setLoading(false);
        return;
      }

      setResult(data.text);
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
    <form onSubmit={handleTranscribe} className="space-y-4">
      <div className="glass-card rounded-xl p-6 space-y-4">
        {/* Upload or record */}
        <div>
          <label className="block text-sm text-[#E1E1E1]/60 mb-2">
            Zvočna datoteka
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.06] transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              {file ? file.name : "Naložite datoteko"}
            </button>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 transition-colors ${
                recording
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-white/[0.04] border-white/[0.06] text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.06]"
              }`}
            >
              {recording ? (
                <>
                  <Square className="w-4 h-4" />
                  Ustavi
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Snemaj
                </>
              )}
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
          <p className="mt-1.5 text-xs text-[#E1E1E1]/30">
            MP3, WAV, M4A, WebM — do 25 MB
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {loading ? "Prepisujem..." : "Prepiši zvok"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#E1E1E1]/60">
              Prepisano besedilo
            </h3>
            <button
              type="button"
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
          </div>
          <p className="text-sm text-[#E1E1E1] leading-relaxed whitespace-pre-wrap">
            {result}
          </p>
        </div>
      )}
    </form>
  );
}
