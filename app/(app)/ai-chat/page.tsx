"use client";

import { useState, useRef, useEffect, type FormEvent, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  Paperclip,
  FileText,
  X,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

type AttachedFile = {
  name: string;
  content: string;
};

const TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json"];
const BINARY_EXTENSIONS = [".pdf", ".docx", ".pptx", ".xlsx"];
const ALL_EXTENSIONS = [...TEXT_EXTENSIONS, ...BINARY_EXTENSIONS];
const ACCEPT = ALL_EXTENSIONS.join(",");

function AIChatPageInner() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [parsingFile, setParsingFile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Pre-fill from ?prompt= query param
  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) {
      setInput(promptParam);
      inputRef.current?.focus();
    }
  }, [searchParams]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  async function loadConversations() {
    setLoadingConvs(true);
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    setConversations(data || []);
    setLoadingConvs(false);
  }

  async function loadMessages(convId: string) {
    setActiveConvId(convId);
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    setMessages(
      (data || []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    );
  }

  function startNewConversation() {
    setActiveConvId(null);
    setMessages([]);
    setInput("");
    setAttachedFile(null);
    inputRef.current?.focus();
  }

  async function deleteConversation(convId: string) {
    await supabase.from("messages").delete().eq("conversation_id", convId);
    await supabase.from("conversations").delete().eq("id", convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConvId === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
  }

  async function handleFileAttach(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      alert("Datoteka je prevelika. Največja velikost je 4 MB.");
      return;
    }

    const name = file.name.toLowerCase();
    const ext = name.slice(name.lastIndexOf("."));

    if (!ALL_EXTENSIONS.includes(ext)) {
      alert(
        `Nepodprt format. Podprti formati: ${ALL_EXTENSIONS.join(", ")}`
      );
      return;
    }

    setParsingFile(true);

    try {
      let text: string;

      if (TEXT_EXTENSIONS.some((e) => name.endsWith(e))) {
        text = await file.text();
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-file", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Napaka pri branju datoteke");
          setParsingFile(false);
          return;
        }
        text = data.text;
      }

      setAttachedFile({ name: file.name, content: text });
    } catch {
      alert("Napaka pri branju datoteke");
    }

    setParsingFile(false);
  }

  async function sendMessage(text: string) {
    if ((!text.trim() && !attachedFile) || loading) return;

    // Build the full message with file content if attached
    let fullMessage = text.trim();
    if (attachedFile) {
      const filePrefix = `[Priložena datoteka: ${attachedFile.name}]\n\n${attachedFile.content}`;
      fullMessage = fullMessage
        ? `${filePrefix}\n\n${fullMessage}`
        : filePrefix;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: fullMessage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: fullMessage,
          messages: history,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Napaka: ${errText}`,
          },
        ]);
        setLoading(false);
        return;
      }

      const convId = response.headers.get("X-Conversation-Id");
      if (convId && !activeConvId) {
        setActiveConvId(convId);
        const rawTitle = response.headers.get("X-Conversation-Title");
        const title = rawTitle
          ? decodeURIComponent(rawTitle)
          : text.slice(0, 60) + (text.length > 60 ? "…" : "");
        setConversations((prev) => [
          {
            id: convId,
            title,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantMsg.content += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: assistantMsg.content }
                : m
            )
          );
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Prišlo je do napake. Poskusite znova.",
        },
      ]);
    }

    setLoading(false);
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    sendMessage(input.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as FormEvent);
    }
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
    if (file) handleFileAttach(file);
  }

  return (
    <div
      className="flex h-[calc(100vh-0px)] overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragging && (
        <div className="absolute inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[#FEB089]/50">
            <FileText className="w-12 h-12 text-[#FEB089]" />
            <p className="text-lg text-[#FEB089] font-medium">
              Spustite datoteko za prilogo
            </p>
            <p className="text-sm text-[#E1E1E1]/40">
              PDF, DOCX, PPTX, XLSX, TXT, MD, CSV, JSON
            </p>
          </div>
        </div>
      )}

      {/* Conversation sidebar */}
      <div className="w-72 shrink-0 bg-[#181818] border-r border-white/[0.06] flex flex-col">
        <div className="p-4">
          <button
            onClick={startNewConversation}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cta-button justify-center"
          >
            <Plus className="w-4 h-4" />
            Nov pogovor
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {loadingConvs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#E1E1E1]/30" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-[#E1E1E1]/30 text-center py-8 px-4">
              Še nimate pogovorov. Začnite novega!
            </p>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors duration-200 ${
                    activeConvId === conv.id
                      ? "bg-white/[0.06] text-white"
                      : "text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.03]"
                  }`}
                  onClick={() => loadMessages(conv.id)}
                >
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      activeConvId === conv.id ? "text-[#FEB089]" : ""
                    }`}
                  />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/[0.06] text-[#E1E1E1]/30 hover:text-red-400 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-[#FEB089]" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                AI Chat
              </h2>
              <p className="text-sm text-[#E1E1E1]/40 text-center max-w-md">
                Postavite vprašanje, prosite za pomoč pri pisanju ali se
                pogovarjajte o marketinških idejah — vse v slovenščini.
              </p>
              <p className="text-xs text-[#E1E1E1]/25 text-center mt-2">
                Priložite datoteke z vlečenjem ali s klikom na sponko.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {[
                  "Napiši mi rojstnodnevno voščilo za prijatelja",
                  "Predlagaj 5 naslovov za blog o zdravi prehrani",
                  "Napiši kratek opis podjetja za spletno stran",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                    className="px-4 py-3 rounded-xl text-sm text-left text-[#E1E1E1]/60 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-[#FEB089]/30 hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "max-w-[85%] px-4 py-3 bg-[#FEB089]/15 text-[#E1E1E1]"
                        : "max-w-[90%] px-5 py-4 bg-white/[0.04] text-[#E1E1E1]/80"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose-chat">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FEB089]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          {/* Attached file indicator */}
          {(attachedFile || parsingFile) && (
            <div className="max-w-3xl mx-auto mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm">
                {parsingFile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FEB089]" />
                    <span className="text-[#E1E1E1]/50">
                      Berem datoteko...
                    </span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-[#FEB089]/60" />
                    <span className="text-[#E1E1E1]/70">
                      {attachedFile!.name}
                    </span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="text-[#E1E1E1]/30 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto flex items-end gap-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileAttach(f);
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || parsingFile}
              className="shrink-0 w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#E1E1E1]/40 hover:text-[#FEB089] hover:border-[#FEB089]/30 transition-colors duration-200 disabled:opacity-40"
              title="Priloži datoteko"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Napišite sporočilo..."
                rows={1}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none pr-12 overflow-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachedFile)}
              className="shrink-0 w-11 h-11 rounded-xl cta-button flex items-center justify-center disabled:opacity-40 transition-opacity duration-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <p className="text-xs text-[#E1E1E1]/20 text-center mt-2">
            1984 AI lahko naredi napake. Preverite pomembne informacije.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  return (
    <Suspense>
      <AIChatPageInner />
    </Suspense>
  );
}
