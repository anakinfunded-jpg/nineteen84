"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
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

export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

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

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build history for API (exclude the current message, it's sent separately)
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
          message: text,
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

      // Get conversation ID and title from header (for new conversations)
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

      // Stream response
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as FormEvent);
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
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
                Zastavite vprašanje, prosite za pomoč pri pisanju ali se
                pogovarjajte o marketinških idejah — vse v slovenščini.
              </p>
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
          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto flex items-end gap-3"
          >
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
              disabled={loading || !input.trim()}
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
