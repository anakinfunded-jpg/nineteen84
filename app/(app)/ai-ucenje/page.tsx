"use client";

import { useState, useRef, type FormEvent, type DragEvent } from "react";
import {
  Loader2,
  Upload,
  GraduationCap,
  FileText,
  Type,
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

type InputMode = "file" | "text";
type StudyMode = "flashcards" | "quiz" | "test";

type Flashcard = { front: string; back: string };
type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};
type TestQuestion = { question: string; answer: string };

type StudyResult =
  | { mode: "flashcards"; cards: Flashcard[] }
  | { mode: "quiz"; questions: QuizQuestion[] }
  | { mode: "test"; questions: TestQuestion[] };

const STUDY_MODES: { id: StudyMode; label: string; desc: string }[] = [
  { id: "flashcards", label: "Učne kartice", desc: "Vprašanje in odgovor" },
  { id: "quiz", label: "Kviz", desc: "Izbirna vprašanja" },
  { id: "test", label: "Preizkus", desc: "Odprti odgovori" },
];

const ACCEPTED_TYPES = ".pdf,.docx,.pptx,.xlsx,.txt,.md";

export default function UcenjePage() {
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [studyMode, setStudyMode] = useState<StudyMode>("flashcards");
  const [result, setResult] = useState<StudyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.size > 4 * 1024 * 1024) {
      setError("Datoteka je prevelika. Največja velikost je 4 MB.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (inputMode === "file" && !file) return;
    if (inputMode === "text" && !text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let res: Response;

      if (inputMode === "file" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", studyMode);
        res = await fetch("/api/ai/study", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai/study", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: studyMode }),
        });
      }

      if (!res.ok) {
        const errText = await res.text();
        setError(errText || "Napaka pri ustvarjanju učnega gradiva");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult({ mode: studyMode, ...data } as StudyResult);
    } catch {
      setError("Napaka pri povezavi s strežnikom");
    }

    setLoading(false);
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">AI Učenje</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Naložite gradivo in ustvarite učne kartice, kvize ali preizkuse
      </p>

      {/* Study mode selector */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {STUDY_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setStudyMode(m.id);
              setResult(null);
            }}
            className={`p-3 rounded-xl text-left transition-all duration-200 ${
              studyMode === m.id
                ? "bg-[#FEB089]/10 border border-[#FEB089]/30 text-white"
                : "glass-card text-[#E1E1E1]/60 hover:text-white"
            }`}
          >
            <p className="text-sm font-medium">{m.label}</p>
            <p className="text-xs mt-0.5 opacity-60">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input */}
        <div className="space-y-4">
          {/* Tab toggle */}
          <div className="glass-card rounded-xl p-1 inline-flex">
            <button
              onClick={() => setInputMode("file")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                inputMode === "file"
                  ? "bg-white/[0.08] text-white"
                  : "text-[#E1E1E1]/50 hover:text-[#E1E1E1]"
              }`}
            >
              <Upload className="w-4 h-4" />
              Datoteka
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                inputMode === "text"
                  ? "bg-white/[0.08] text-white"
                  : "text-[#E1E1E1]/50 hover:text-[#E1E1E1]"
              }`}
            >
              <Type className="w-4 h-4" />
              Besedilo
            </button>
          </div>

          {inputMode === "file" ? (
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
              {file ? (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-[#FEB089]/50" />
                  </div>
                  <p className="text-sm text-[#E1E1E1]">{file.name}</p>
                  <p className="text-xs text-[#E1E1E1]/30 mt-1">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-red-400 bg-white/[0.04] hover:bg-white/[0.06] transition-colors mx-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                    Odstrani
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                    <Upload className="w-7 h-7 text-[#FEB089]/50" />
                  </div>
                  <p className="text-sm text-[#E1E1E1]/50 text-center">
                    Povlecite datoteko sem ali kliknite za nalaganje
                  </p>
                  <p className="text-xs text-[#E1E1E1]/30 mt-1">
                    PDF, DOCX, PPTX, XLSX, TXT, MD — do 4 MB
                  </p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                className="hidden"
              />
            </div>
          ) : (
            <div className="glass-card rounded-xl p-5">
              <label className="block text-sm text-[#E1E1E1]/60 mb-2">
                Učno gradivo
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Prilepite besedilo iz učbenika, zapiskov ali predavanj..."
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors duration-200 resize-none"
              />
              <div className="mt-2">
                <span className="text-xs text-[#E1E1E1]/30">
                  {wordCount} besed
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              (inputMode === "file" && !file) ||
              (inputMode === "text" && !text.trim())
            }
            className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GraduationCap className="w-4 h-4" />
            )}
            {loading
              ? "Ustvarjam..."
              : `Ustvari ${STUDY_MODES.find((m) => m.id === studyMode)?.label?.toLowerCase() || "gradivo"}`}
          </button>
        </div>

        {/* Right: Results */}
        <div className="min-h-[380px]">
          {loading && !result && (
            <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[380px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#FEB089]/50 mb-4" />
              <p className="text-sm text-[#E1E1E1]/50">
                Ustvarjam učno gradivo...
              </p>
            </div>
          )}

          {!result && !loading && (
            <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[380px] text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-[#FEB089]/30" />
              </div>
              <p className="text-sm text-[#E1E1E1]/30">
                Naložite gradivo in izberite način za ustvarjanje učnega
                materiala
              </p>
            </div>
          )}

          {result?.mode === "flashcards" && (
            <FlashcardsView
              cards={result.cards}
              onRegenerate={handleSubmit}
            />
          )}

          {result?.mode === "quiz" && (
            <QuizView
              questions={result.questions}
              onRegenerate={handleSubmit}
            />
          )}

          {result?.mode === "test" && (
            <TestView
              questions={result.questions}
              onRegenerate={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FlashcardsView({
  cards,
  onRegenerate,
}: {
  cards: Flashcard[];
  onRegenerate: (e: FormEvent) => void;
}) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  function toggleFlip(index: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#E1E1E1]/60">
          {cards.length} {cards.length === 1 ? "kartica" : cards.length === 2 ? "kartici" : cards.length <= 4 ? "kartice" : "kartic"}
        </p>
        <button
          onClick={(e) => {
            setFlipped(new Set());
            onRegenerate(e as unknown as FormEvent);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Ponovno ustvari
        </button>
      </div>

      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => toggleFlip(i)}
          className="w-full glass-card rounded-xl p-5 text-left transition-all duration-200 hover:bg-white/[0.04]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-[#FEB089]/60 mb-1.5">
                {flipped.has(i) ? "Odgovor" : "Vprašanje"} {i + 1}
              </p>
              <p className="text-sm text-[#E1E1E1] leading-relaxed">
                {flipped.has(i) ? card.back : card.front}
              </p>
            </div>
            <RotateCcw className="w-4 h-4 text-[#E1E1E1]/20 shrink-0 mt-1" />
          </div>
        </button>
      ))}
    </div>
  );
}

function QuizView({
  questions,
  onRegenerate,
}: {
  questions: QuizQuestion[];
  onRegenerate: (e: FormEvent) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  function selectAnswer(qIndex: number, optIndex: number) {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  function checkResults() {
    setShowResults(true);
  }

  const answeredAll = Object.keys(answers).length === questions.length;
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correct
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#E1E1E1]/60">
          {questions.length} {questions.length === 1 ? "vprašanje" : questions.length === 2 ? "vprašanji" : questions.length <= 4 ? "vprašanja" : "vprašanj"}
          {showResults && (
            <span className="ml-2 text-[#FEB089]">
              {correctCount}/{questions.length} pravilnih
            </span>
          )}
        </p>
        <button
          onClick={(e) => {
            setAnswers({});
            setShowResults(false);
            onRegenerate(e as unknown as FormEvent);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Ponovno ustvari
        </button>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="glass-card rounded-xl p-5">
          <p className="text-xs text-[#FEB089]/60 mb-1.5">
            Vprašanje {qi + 1}
          </p>
          <p className="text-sm text-[#E1E1E1] mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect = q.correct === oi;

              let optClass =
                "bg-white/[0.03] border border-white/[0.06] text-[#E1E1E1]/60 hover:bg-white/[0.05]";

              if (showResults) {
                if (isCorrect) {
                  optClass =
                    "bg-green-500/10 border border-green-500/30 text-green-400";
                } else if (isSelected && !isCorrect) {
                  optClass =
                    "bg-red-500/10 border border-red-500/30 text-red-400";
                }
              } else if (isSelected) {
                optClass =
                  "bg-white/[0.08] border border-[#FEB089]/30 text-white";
              }

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(qi, oi)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 flex items-center gap-3 ${optClass}`}
                >
                  {showResults && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  {showResults && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  {!showResults && (
                    <span className="text-xs opacity-50">
                      {String.fromCharCode(65 + oi)}
                    </span>
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
          {showResults && answers[qi] !== q.correct && q.explanation && (
            <p className="mt-2 text-xs text-[#E1E1E1]/40 italic">
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!showResults && answeredAll && (
        <button
          onClick={checkResults}
          className="w-full cta-button py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Preveri odgovore
        </button>
      )}
    </div>
  );
}

function TestView({
  questions,
  onRegenerate,
}: {
  questions: TestQuestion[];
  onRegenerate: (e: FormEvent) => void;
}) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggleReveal(index: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#E1E1E1]/60">
          {questions.length} {questions.length === 1 ? "vprašanje" : questions.length === 2 ? "vprašanji" : questions.length <= 4 ? "vprašanja" : "vprašanj"}
        </p>
        <button
          onClick={(e) => {
            setRevealed(new Set());
            onRegenerate(e as unknown as FormEvent);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.04] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Ponovno ustvari
        </button>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="glass-card rounded-xl p-5">
          <p className="text-xs text-[#FEB089]/60 mb-1.5">
            Vprašanje {i + 1}
          </p>
          <p className="text-sm text-[#E1E1E1] mb-3">{q.question}</p>

          {revealed.has(i) ? (
            <div className="px-4 py-3 rounded-xl bg-[#FEB089]/5 border border-[#FEB089]/10">
              <p className="text-sm text-[#E1E1E1]/80 leading-relaxed">
                {q.answer}
              </p>
            </div>
          ) : null}

          <button
            onClick={() => toggleReveal(i)}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#E1E1E1]/40 hover:text-[#FEB089] transition-colors"
          >
            {revealed.has(i) ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {revealed.has(i) ? "Skrij odgovor" : "Pokaži odgovor"}
          </button>
        </div>
      ))}
    </div>
  );
}
