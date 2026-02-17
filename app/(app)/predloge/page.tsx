"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ArrowRight,
  Briefcase,
  Megaphone,
  ShoppingCart,
  GraduationCap,
  Feather,
  Share2,
  Mail,
  Search as SearchIcon,
  Image,
  Volume2,
  ListChecks,
  Home,
  type LucideIcon,
} from "lucide-react";
import {
  promptCategories,
  allPrompts,
  getPromptsByCategory,
  searchPrompts,
  type PromptCategory,
  type Prompt,
} from "@/lib/prompts/prompt-library";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Megaphone,
  ShoppingCart,
  GraduationCap,
  Feather,
  Share2,
  Mail,
  Search: SearchIcon,
  Image,
  Volume2,
  ListChecks,
  Home,
};

function PredlogePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("kategorija") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    let results: Prompt[];

    if (searchQuery.trim()) {
      results = searchPrompts(searchQuery);
    } else if (activeCategory === "all") {
      results = allPrompts;
    } else {
      results = getPromptsByCategory(activeCategory);
    }

    return results;
  }, [activeCategory, searchQuery]);

  function handleUse(prompt: Prompt) {
    const encoded = encodeURIComponent(prompt.prompt);
    if (prompt.tool === "ai-besedila") {
      router.push(`/${prompt.tool}`);
    } else {
      router.push(`/${prompt.tool}?prompt=${encoded}`);
    }
  }

  async function handleCopy(prompt: Prompt) {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  function getCategoryIcon(iconName: string): LucideIcon {
    return iconMap[iconName] || BookOpen;
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-[#FEB089]" />
          <h1 className="text-2xl font-semibold text-white">
            Knjižnica predlog
          </h1>
        </div>
        <p className="mt-1 text-sm text-[#E1E1E1]/50">
          120+ pripravljenih predlog za vse priložnosti — izberite, prilagodite
          in začnite ustvarjati
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E1E1E1]/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim()) setActiveCategory("all");
          }}
          placeholder="Išči predloge..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
        />
      </div>

      {/* Category pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => {
            setActiveCategory("all");
            setSearchQuery("");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-[#FEB089]/15 text-[#FEB089] border border-[#FEB089]/30"
              : "bg-white/[0.04] text-[#E1E1E1]/50 border border-white/[0.06] hover:text-[#E1E1E1] hover:bg-white/[0.06]"
          }`}
        >
          Vse ({allPrompts.length})
        </button>
        {promptCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          const count = getPromptsByCategory(cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-[#FEB089]/15 text-[#FEB089] border border-[#FEB089]/30"
                  : "bg-white/[0.04] text-[#E1E1E1]/50 border border-white/[0.06] hover:text-[#E1E1E1] hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="mt-4 text-xs text-[#E1E1E1]/30">
        {filteredPrompts.length}{" "}
        {filteredPrompts.length === 1 ? "predloga" : filteredPrompts.length === 2 ? "predlogi" : filteredPrompts.length <= 4 ? "predloge" : "predlog"}
        {searchQuery && ` za "${searchQuery}"`}
      </p>

      {/* Prompt grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => {
          const category = promptCategories.find(
            (c) => c.id === prompt.categoryId
          );
          const Icon = category ? getCategoryIcon(category.icon) : BookOpen;
          const isExpanded = expandedId === prompt.id;

          return (
            <div
              key={prompt.id}
              className="glass-card rounded-xl p-5 flex flex-col"
            >
              {/* Category badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <Icon className="w-3 h-3 text-[#FEB089]" />
                  <span className="text-xs text-[#E1E1E1]/50">
                    {category?.label}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-white mb-2">
                {prompt.title}
              </h3>

              {/* Prompt text */}
              <div
                className={`text-sm text-[#E1E1E1]/60 leading-relaxed flex-1 ${
                  !isExpanded ? "line-clamp-3" : ""
                }`}
              >
                {prompt.prompt}
              </div>
              {prompt.prompt.length > 150 && (
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : prompt.id)
                  }
                  className="text-xs text-[#FEB089]/70 hover:text-[#FEB089] mt-1 self-start"
                >
                  {isExpanded ? "Prikaži manj" : "Prikaži več"}
                </button>
              )}

              {/* Bottom row */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <span className="text-xs text-[#E1E1E1]/30 bg-white/[0.03] px-2.5 py-1 rounded-full">
                  {prompt.toolLabel}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/40 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors duration-200"
                    title="Kopiraj predlogo"
                  >
                    {copiedId === prompt.id ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedId === prompt.id ? "Kopirano" : "Kopiraj"}
                  </button>
                  <button
                    onClick={() => handleUse(prompt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#171717] cta-gradient hover:opacity-90 transition-opacity duration-200"
                  >
                    Uporabi
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-[#E1E1E1]/30">
            Ni rezultatov za iskanje &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export default function PredlogePageWrapper() {
  return (
    <Suspense>
      <PredlogePage />
    </Suspense>
  );
}
