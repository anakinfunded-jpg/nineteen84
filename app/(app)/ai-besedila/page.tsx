"use client";

import { useState, type FormEvent } from "react";
import { templates, categories, type Template } from "@/lib/ai/templates";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ShoppingBag,
  Wrench,
  Users,
  Globe,
  Search,
  Share2,
  Camera,
  Briefcase,
  Megaphone,
  Type,
  TrendingUp,
  Mail,
  BookOpen,
  Newspaper,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Wrench,
  Users,
  Globe,
  Search,
  Share2,
  Camera,
  Briefcase,
  Megaphone,
  Type,
  TrendingUp,
  Mail,
  BookOpen,
  Newspaper,
  CalendarDays,
};

export default function BesedilaPage() {
  const [selected, setSelected] = useState<Template | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function selectTemplate(t: Template) {
    setSelected(t);
    const defaults: Record<string, string> = {};
    t.fields.forEach((f) => {
      defaults[f.id] = f.type === "select" && f.options ? f.options[0] : "";
    });
    setFields(defaults);
    setOutput("");
  }

  function goBack() {
    setSelected(null);
    setFields({});
    setOutput("");
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    setOutput("");

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: selected.id, fields }),
    });

    if (!response.ok) {
      const text = await response.text();
      setOutput(`Napaka: ${text}`);
      setLoading(false);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value));
      }
    }

    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── Template Grid ───
  if (!selected) {
    const filtered = activeCategory
      ? templates.filter((t) => t.category === activeCategory)
      : templates;

    return (
      <div className="p-8 max-w-6xl">
        <h1 className="text-2xl font-semibold text-white">AI Besedila</h1>
        <p className="mt-1 text-sm text-[#E1E1E1]/50">
          Izberite predlogo in ustvarite vsebino v slovenščini
        </p>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
              !activeCategory
                ? "cta-gradient text-[#171717]"
                : "bg-white/[0.04] text-[#E1E1E1]/60 hover:bg-white/[0.08] hover:text-[#E1E1E1]"
            }`}
          >
            Vse
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                activeCategory === cat
                  ? "cta-gradient text-[#171717]"
                  : "bg-white/[0.04] text-[#E1E1E1]/60 hover:bg-white/[0.08] hover:text-[#E1E1E1]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const Icon = iconMap[t.icon] || Sparkles;
            return (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className="glass-card group rounded-xl p-5 text-left hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-white/[0.06] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#FEB089]" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {t.name}
                </h3>
                <p className="mt-1 text-xs text-[#E1E1E1]/40">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Generation Interface ───
  const Icon = iconMap[selected.icon] || Sparkles;

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-[#E1E1E1]/50 hover:text-[#E1E1E1] transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazaj na predloge
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#FEB089]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">{selected.name}</h1>
          <p className="text-sm text-[#E1E1E1]/40">{selected.description}</p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          {selected.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                {field.label}
                {field.required && (
                  <span className="text-[#FEB089] ml-1">*</span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  value={fields[field.id] || ""}
                  onChange={(e) =>
                    setFields({ ...fields, [field.id]: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 appearance-none"
                >
                  {field.options?.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className="bg-[#191919] text-[#E1E1E1]"
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={fields[field.id] || ""}
                  onChange={(e) =>
                    setFields({ ...fields, [field.id]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={fields[field.id] || ""}
                  onChange={(e) =>
                    setFields({ ...fields, [field.id]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Generiram..." : "Generiraj vsebino"}
          </button>
        </form>

        {/* Right: Output */}
        <div className="glass-card rounded-xl p-6 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#E1E1E1]/60">
              Rezultat
            </h3>
            {output && !loading && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#E1E1E1]/40 hover:text-[#E1E1E1] transition-colors duration-200 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    Kopirano
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Kopiraj
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1">
            {loading && !output && (
              <div className="flex items-center gap-3 text-[#E1E1E1]/30 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#FEB089]" />
                Ustvarjam vsebino...
              </div>
            )}

            {output ? (
              <div className="text-sm text-[#E1E1E1]/80 leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
            ) : (
              !loading && (
                <p className="text-sm text-[#E1E1E1]/20">
                  Izpolnite polja in kliknite &quot;Generiraj vsebino&quot;
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
