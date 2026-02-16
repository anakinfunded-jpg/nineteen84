"use client";

import { useState, useEffect, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Brain,
  Upload,
  Trash2,
  Send,
  FileText,
  Plus,
  X,
  Copy,
  Check,
} from "lucide-react";

type Document = {
  id: string;
  title: string;
  created_at: string;
};

export default function SpominPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Upload state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Query state
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [querying, setQuerying] = useState(false);
  const [queryError, setQueryError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoadingDocs(true);
    try {
      const res = await fetch("/api/ai/memory");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch {
      // silent
    }
    setLoadingDocs(false);
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || uploading) return;

    setUploading(true);
    setUploadError("");

    try {
      const res = await fetch("/api/ai/memory/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Napaka pri nalaganju");
        setUploading(false);
        return;
      }

      setTitle("");
      setContent("");
      setShowUpload(false);
      await loadDocuments();
    } catch {
      setUploadError("Napaka pri povezavi s strežnikom");
    }

    setUploading(false);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/ai/memory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch {
      // silent
    }
  }

  async function handleFileUpload(file: File) {
    const text = await file.text();
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setContent(text);
    setShowUpload(true);
  }

  async function handleQuery(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() || querying) return;

    setQuerying(true);
    setQueryError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ai/memory/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const text = await res.text();
        setQueryError(text);
        setQuerying(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setAnswer((prev) => prev + decoder.decode(value));
        }
      }
    } catch {
      setQueryError("Napaka pri povezavi s strežnikom");
    }

    setQuerying(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">AI Spomin</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Naložite dokumente in zastavljajte vprašanja na podlagi vaše baze znanja
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left: Query + Results */}
        <div className="space-y-4">
          {/* Query form */}
          <form onSubmit={handleQuery} className="glass-card rounded-xl p-5">
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Vprašajte svoje dokumente
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="npr. Kakšni so bili rezultati zadnjega kvartala?"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={!query.trim() || querying}
                className="cta-button px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {querying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            {queryError && (
              <p className="mt-2 text-sm text-red-400">{queryError}</p>
            )}
          </form>

          {/* Answer */}
          {answer && (
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#E1E1E1]/60">
                  Odgovor
                </h3>
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
              </div>
              <div className="prose-chat text-sm text-[#E1E1E1] leading-relaxed">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          )}

          {!answer && !querying && (
            <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-[#FEB089]/30" />
              </div>
              <p className="text-sm text-[#E1E1E1]/30">
                Naložite dokumente v bazo znanja in zastavljajte vprašanja.
                AI bo odgovarjal na podlagi vaših podatkov.
              </p>
            </div>
          )}
        </div>

        {/* Right: Documents list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#E1E1E1]/60">
              Dokumenti ({documents.length})
            </h2>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#FEB089] hover:bg-white/[0.04] transition-colors"
            >
              {showUpload ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {showUpload ? "Prekliči" : "Dodaj"}
            </button>
          </div>

          {/* Upload form */}
          {showUpload && (
            <form
              onSubmit={handleUpload}
              className="glass-card rounded-xl p-4 space-y-3"
            >
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Naslov dokumenta"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
                />
              </div>
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Prilepite vsebino dokumenta ali naložite datoteko..."
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".txt,.md,.csv,.json";
                    input.onchange = (e) => {
                      const f = (e.target as HTMLInputElement).files?.[0];
                      if (f) handleFileUpload(f);
                    };
                    input.click();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Datoteka
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || uploading}
                  className="flex-1 cta-button px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  {uploading ? "Shranjujem..." : "Shrani"}
                </button>
              </div>
              {uploadError && (
                <p className="text-xs text-red-400">{uploadError}</p>
              )}
            </form>
          )}

          {/* Documents list */}
          {loadingDocs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#E1E1E1]/30" />
            </div>
          ) : documents.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-[#E1E1E1]/20 mx-auto mb-2" />
              <p className="text-xs text-[#E1E1E1]/30">
                Še niste naložili dokumentov
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card rounded-xl px-4 py-3 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#FEB089]/50 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#E1E1E1] truncate">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-[#E1E1E1]/30">
                        {new Date(doc.created_at).toLocaleDateString("sl-SI")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-lg text-[#E1E1E1]/20 hover:text-red-400 hover:bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-all"
                    title="Izbriši"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
