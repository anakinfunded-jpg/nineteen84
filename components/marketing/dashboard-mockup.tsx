/**
 * Realistic CSS-based dashboard mockup component for feature detail pages.
 * Renders high-fidelity dark-themed dashboard previews with real Slovenian text.
 */

type MockupType =
  | "chat"
  | "chat-writing"
  | "model-routing"
  | "templates"
  | "text-generate"
  | "copywriting"
  | "gallery"
  | "image-rights"
  | "editor"
  | "tone-adjust"
  | "translator"
  | "languages"
  | "audio-tts"
  | "audio-stt"
  | "vision"
  | "canvas"
  | "inpainting-result"
  | "compare"
  | "upload"
  | "converter";

const screenshotKeyToType: Record<string, MockupType> = {
  "ai-chat-conversation": "chat",
  "ai-chat-writing": "chat-writing",
  "ai-chat-routing": "model-routing",
  "ai-besedila-templates": "templates",
  "ai-besedila-generate": "text-generate",
  "ai-besedila-copywriting": "copywriting",
  "ai-grafika-gallery": "gallery",
  "ai-grafika-rights": "image-rights",
  "ai-grafika-manage": "gallery",
  "ai-dokumenti-edit": "editor",
  "ai-dokumenti-tone": "tone-adjust",
  "ai-prevajalnik-translate": "translator",
  "ai-prevajalnik-languages": "languages",
  "ai-zvok-tts": "audio-tts",
  "ai-zvok-stt": "audio-stt",
  "ai-vid-describe": "vision",
  "ai-vid-ocr": "vision",
  "ai-inpainting-canvas": "canvas",
  "ai-inpainting-result": "inpainting-result",
  "ai-zamenjava-compare": "compare",
  "ai-spomin-upload": "upload",
  "ai-spomin-query": "chat",
  "pretvorniki-ui": "converter",
};

function WindowBar() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.08] bg-[#1a1a1a]">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <div className="flex-1 mx-8">
        <div className="h-5 bg-white/[0.06] rounded-md max-w-[180px] mx-auto flex items-center justify-center">
          <span className="text-[9px] text-white/20">1984.si</span>
        </div>
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="flex-1 p-4 space-y-3 overflow-hidden">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-[#FEB089]/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[75%] border border-[#FEB089]/10">
            <p className="text-[11px] text-[#FEB089]/80 leading-relaxed">
              Napiši mi kratek opis za spletno trgovino z ročno izdelanimi nakiti.
            </p>
          </div>
        </div>
        {/* AI message */}
        <div className="flex justify-start gap-2">
          <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-[#FEB089]/30 to-[#EE94B0]/30 flex items-center justify-center mt-0.5">
            <span className="text-[8px] text-white/60 font-bold">AI</span>
          </div>
          <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%] border border-white/[0.06]">
            <p className="text-[11px] text-white/70 leading-relaxed">
              Odkrijte edinstvene, ročno izdelane nakite, ki pripovedujejo vašo zgodbo. Vsak kos je unikat — ustvarjen z ljubeznijo in pozornostjo do detajlov.
            </p>
          </div>
        </div>
        {/* User follow-up */}
        <div className="flex justify-end">
          <div className="bg-[#FEB089]/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[60%] border border-[#FEB089]/10">
            <p className="text-[11px] text-[#FEB089]/80 leading-relaxed">
              Super! Lahko dodaš še poziv k akciji?
            </p>
          </div>
        </div>
        {/* AI response */}
        <div className="flex justify-start gap-2">
          <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-[#FEB089]/30 to-[#EE94B0]/30 flex items-center justify-center mt-0.5">
            <span className="text-[8px] text-white/60 font-bold">AI</span>
          </div>
          <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%] border border-white/[0.06]">
            <p className="text-[11px] text-white/70 leading-relaxed">
              Poiščite svoj popoln kos — brskajte po naši kolekciji in naj vas očara čar ročnega dela. Naročite danes!
            </p>
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-4 py-3 border border-white/[0.08]">
          <span className="flex-1 text-[11px] text-white/20">Vprašajte karkoli...</span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#171717]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L18 12M12 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatesMockup() {
  const templates = [
    { icon: "📝", name: "Blog objava", desc: "SEO optimizirana vsebina" },
    { icon: "📧", name: "E-poštno sporočilo", desc: "Profesionalna e-pošta" },
    { icon: "📱", name: "Objava za družb. omrežja", desc: "Kratka in jedrnata" },
    { icon: "📰", name: "Novičarski članek", desc: "Novinarski slog" },
    { icon: "🛒", name: "Opis izdelka", desc: "Prepričljiv prodajni opis" },
    { icon: "📊", name: "Poslovno poročilo", desc: "Strukturirano poročilo" },
  ];

  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Besedila</span>
        </div>
        <p className="text-[10px] text-white/30 mb-3">Izberite predlogo in ustvarite vsebino</p>
        {/* Category pills */}
        <div className="flex gap-1.5 mb-3 overflow-hidden">
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-gradient-to-r from-[#FFB288] to-[#EE94B0] text-[#171717] font-medium">Vse</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/40">Marketing</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/40">Prodaja</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/40">SEO</span>
        </div>
        {/* Template grid */}
        <div className="grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{t.icon}</span>
                <span className="text-[10px] font-medium text-white/70">{t.name}</span>
              </div>
              <span className="text-[9px] text-white/30">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryMockup() {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  ];

  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12px] font-semibold text-white/80">AI Grafika</span>
        </div>
        {/* Prompt bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-xl border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/25">Opiši sliko, ki jo želiš ustvariti...</span>
          </div>
          <div className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center">
            <span className="text-[10px] font-semibold text-[#171717]">Generiraj</span>
          </div>
        </div>
        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2">
          {gradients.map((bg, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg overflow-hidden border border-white/[0.06]"
              style={{ background: bg }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Dokumenti</span>
        </div>
        {/* Toolbar */}
        <div className="flex gap-1.5">
          {[
            { label: "Izboljšaj", active: true },
            { label: "Skrajšaj", active: false },
            { label: "Podaljšaj", active: false },
            { label: "Povzemi", active: false },
          ].map((btn) => (
            <div
              key={btn.label}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-medium ${
                btn.active
                  ? "bg-[#FEB089]/20 text-[#FEB089] border border-[#FEB089]/20"
                  : "bg-white/[0.05] text-white/30 border border-white/[0.06]"
              }`}
            >
              {btn.label}
            </div>
          ))}
        </div>
        {/* Text area */}
        <div className="flex-1 bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Digitalna transformacija je proces, ki vključuje integracijo digitalnih tehnologij v vse vidike poslovanja. To temeljito spreminja način delovanja podjetij in zagotavljanja vrednosti strankam.
          </p>
        </div>
        {/* Result preview */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-[#FEB089]/15">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Rezultat</span>
          </div>
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Digitalna preobrazba revolucionarno spreminja poslovanje z integracijo naprednih tehnologij. Podjetja pridobijo konkurenčno prednost s hitrejšimi procesi in boljšo uporabniško izkušnjo.
          </p>
        </div>
      </div>
    </div>
  );
}

function TranslatorMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Prevajalnik</span>
        </div>
        {/* Language selectors */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/50 font-medium">🇸🇮 Slovenščina</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
            <span className="text-white/30 text-[10px]">⇄</span>
          </div>
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/50 font-medium">🇬🇧 Angleščina</span>
          </div>
        </div>
        {/* Two columns */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
            <p className="text-[10px] text-white/50 leading-[1.7]">
              Naše podjetje ponuja celovite rešitve za digitalni marketing. Specializirani smo za ustvarjanje vsebin v slovenskem jeziku.
            </p>
          </div>
          <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-[#FEB089]/15">
            <p className="text-[10px] text-[#FEB089]/60 leading-[1.7]">
              Our company offers comprehensive digital marketing solutions. We specialize in creating content in the Slovenian language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioTTSMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Besedilo v govor</span>
        </div>
        {/* Text input */}
        <div className="flex-1 bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Dobrodošli na naši spletni strani. Danes vam predstavljamo najnovejše funkcije za ustvarjanje vsebin s pomočjo umetne inteligence.
          </p>
          <div className="mt-2 text-right">
            <span className="text-[9px] text-white/20">156/4096</span>
          </div>
        </div>
        {/* Voice selector */}
        <div className="flex gap-1.5">
          {["Alloy", "Nova", "Echo", "Onyx", "Shimmer"].map((v, i) => (
            <div
              key={v}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-medium ${
                i === 0
                  ? "bg-[#FEB089]/20 text-[#FEB089] border border-[#FEB089]/20"
                  : "bg-white/[0.05] text-white/30 border border-white/[0.06]"
              }`}
            >
              {v}
            </div>
          ))}
        </div>
        {/* Speed slider */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-white/30">Hitrost: 1.0x</span>
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full">
            <div className="h-full bg-[#FEB089]/40 rounded-full w-[40%]" />
          </div>
        </div>
        {/* Audio player */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-[#171717] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {/* Waveform */}
            <div className="flex-1 flex items-center gap-[2px] h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#FEB089]/30 rounded-full min-w-[2px]"
                  style={{
                    height: `${25 + Math.sin(i * 0.7) * 50 + (i % 3) * 10}%`,
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] text-white/25 shrink-0">0:12</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioSTTMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Govor v besedilo</span>
        </div>
        {/* Upload area */}
        <div className="flex-1 border-2 border-dashed border-white/[0.12] rounded-xl flex items-center justify-center bg-white/[0.02]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FEB089]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-[10px] text-white/40 font-medium">Naložite zvočno datoteko</p>
            <p className="text-[9px] text-white/20 mt-0.5">MP3, WAV, M4A — do 25 MB</p>
          </div>
        </div>
        {/* Record button */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-xl border border-white/[0.08] flex items-center justify-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="text-[10px] text-white/40">Snemaj</span>
          </div>
        </div>
        {/* Result */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-[#FEB089]/15">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Prepisano besedilo</span>
          </div>
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Danes bi rad predstavil naš novi izdelek, ki je namenjen malim in srednje velikim podjetjem v Sloveniji...
          </p>
        </div>
      </div>
    </div>
  );
}

function VisionMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex gap-3 flex-1">
        {/* Left: Image & controls */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Image preview */}
          <div className="flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-[#2a2040] to-[#1a1530] flex items-center justify-center border border-white/[0.08] relative">
            <div className="w-20 h-14 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
              <svg className="w-8 h-8 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          {/* Mode selector */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-white/[0.08] rounded-lg py-1.5 text-center border border-[#FEB089]/25">
              <span className="text-[9px] text-white/70 font-medium">Opiši sliko</span>
            </div>
            <div className="bg-white/[0.04] rounded-lg py-1.5 text-center border border-white/[0.06]">
              <span className="text-[9px] text-white/30">Izvleci besedilo</span>
            </div>
          </div>
        </div>
        {/* Right: Analysis result */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06] flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Opis slike</span>
          </div>
          <p className="text-[10px] text-white/50 leading-[1.7] flex-1">
            Na sliki je prikazan moderen pisarniški prostor z velikimi okni, skozi katera prihaja naravna svetloba. V ospredju je lesena miza z računalnikom in zeleno rastlino.
          </p>
        </div>
      </div>
    </div>
  );
}

function CanvasMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Inpainting</span>
        </div>
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FEB089]/20 border border-[#FEB089]/25 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#FEB089]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full">
            <div className="h-full bg-[#FEB089]/40 rounded-full w-1/3" />
          </div>
          <span className="text-[9px] text-white/25">20px</span>
        </div>
        {/* Canvas */}
        <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1e2030] to-[#181825] relative overflow-hidden border border-white/[0.08]">
          {/* Sample image placeholder */}
          <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-white/[0.04] to-white/[0.02] flex items-center justify-center">
            <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          {/* Brush stroke overlay */}
          <div
            className="absolute top-[30%] left-[20%] w-24 h-14 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(254,176,137,0.25), transparent 70%)",
            }}
          />
          <div
            className="absolute top-[35%] left-[35%] w-16 h-10 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(254,176,137,0.2), transparent 70%)",
            }}
          />
          {/* Mask indicator */}
          <div className="absolute top-[28%] left-[22%] w-20 h-12 border-2 border-dashed border-[#FEB089]/30 rounded-lg" />
        </div>
        {/* Prompt input */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/25">Opiši, kaj naj AI nariše...</span>
          </div>
          <div className="h-9 px-3 rounded-lg bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center">
            <span className="text-[9px] font-semibold text-[#171717]">Generiraj</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Najdi in spremeni</span>
        </div>
        {/* Find & Replace inputs */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/40">Najdi: rdeč avto</span>
          </div>
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/40">Zamenjaj: moder avto</span>
          </div>
        </div>
        {/* Before/After */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1e1a2e] to-[#15132a] flex flex-col items-center justify-center border border-white/[0.08]">
            <span className="text-[9px] text-white/30 mb-2 font-medium">Pred</span>
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/15 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1a1e2e] to-[#13152a] flex flex-col items-center justify-center border border-[#FEB089]/15">
            <span className="text-[9px] text-[#FEB089]/50 mb-2 font-medium">Po</span>
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/15 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadMockup() {
  const docs = [
    { name: "Predstavitev podjetja.pdf", size: "2.3 MB", icon: "📄" },
    { name: "Cenik izdelkov.xlsx", size: "156 KB", icon: "📊" },
    { name: "Pogosta vprašanja.md", size: "8.4 KB", icon: "📝" },
  ];

  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Spomin</span>
        </div>
        {/* Upload area */}
        <div className="border-2 border-dashed border-white/[0.12] rounded-xl p-4 text-center bg-white/[0.02]">
          <svg className="w-6 h-6 mx-auto mb-1.5 text-[#FEB089]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-[10px] text-white/40 font-medium">Naložite dokumente</p>
          <p className="text-[9px] text-white/20 mt-0.5">PDF, TXT, MD, DOCX</p>
        </div>
        {/* Document list */}
        <div className="space-y-1.5 flex-1">
          {docs.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-3 bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/[0.06]"
            >
              <span className="text-sm">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/60 font-medium truncate">{doc.name}</p>
              </div>
              <span className="text-[9px] text-white/20 shrink-0">{doc.size}</span>
            </div>
          ))}
        </div>
        {/* Query input */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/25">Vprašajte o dokumentih...</span>
          </div>
          <div className="h-9 px-3 rounded-lg bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center">
            <span className="text-[9px] font-semibold text-[#171717]">Išči</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConverterMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Pretvornik slik</span>
        </div>
        {/* Format selector */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/50 font-medium">PNG</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
            <span className="text-white/30 text-[10px]">→</span>
          </div>
          <div className="flex-1 h-9 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center px-3">
            <span className="text-[10px] text-white/50 font-medium">WebP</span>
          </div>
        </div>
        {/* Quality slider */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-white/30">Kakovost: 85%</span>
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full">
            <div className="h-full bg-[#FEB089]/40 rounded-full w-[85%]" />
          </div>
        </div>
        {/* Upload area */}
        <div className="flex-1 border-2 border-dashed border-white/[0.12] rounded-xl flex items-center justify-center bg-white/[0.02]">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <svg className="w-6 h-6 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-[10px] text-white/40 font-medium">Povlecite sliko ali kliknite</p>
            <p className="text-[9px] text-white/20 mt-0.5">JPG, PNG, WebP, GIF</p>
          </div>
        </div>
        {/* Convert button */}
        <div className="h-10 rounded-xl bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center justify-center">
          <span className="text-[11px] font-semibold text-[#171717]">Pretvori sliko</span>
        </div>
      </div>
    </div>
  );
}

function ChatWritingMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">AI Pisanje</span>
        </div>
        {/* User request */}
        <div className="bg-[#FEB089]/15 rounded-xl p-3 border border-[#FEB089]/10">
          <p className="text-[10px] text-[#FEB089]/70 leading-[1.6]">
            Napiši profesionalen e-mail za predstavitev novega izdelka strankam.
          </p>
        </div>
        {/* AI writing output */}
        <div className="flex-1 bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">AI piše...</span>
          </div>
          <p className="text-[10px] text-white/60 leading-[1.7]">
            Spoštovani,
          </p>
          <p className="text-[10px] text-white/60 leading-[1.7] mt-1.5">
            Z veseljem vam predstavljamo naš najnovejši izdelek, ki bo poenostavil vaše vsakodnevno delo. Zasnovan je bil s ciljem povečati vašo produktivnost...
          </p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-1.5 h-3.5 bg-[#FEB089]/60 animate-pulse rounded-sm" />
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-white/[0.05] rounded-lg border border-white/[0.06] flex items-center justify-center gap-1.5">
            <span className="text-[9px] text-white/30">Kopiraj</span>
          </div>
          <div className="flex-1 h-8 bg-white/[0.05] rounded-lg border border-white/[0.06] flex items-center justify-center gap-1.5">
            <span className="text-[9px] text-white/30">Izboljšaj</span>
          </div>
          <div className="flex-1 h-8 bg-white/[0.05] rounded-lg border border-white/[0.06] flex items-center justify-center gap-1.5">
            <span className="text-[9px] text-white/30">Skrajšaj</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelRoutingMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Pametno usmerjanje</span>
        </div>
        {/* Model cards */}
        <div className="space-y-2">
          <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-medium text-white/70">Claude Haiku 4.5</span>
              </div>
              <span className="text-[9px] text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded-full">Hiter</span>
            </div>
            <p className="text-[9px] text-white/30 leading-relaxed">Preprosta vprašanja, kratki odgovori, rutinske naloge</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3 border border-[#FEB089]/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FEB089]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
                </div>
                <span className="text-[10px] font-medium text-white/70">Claude Sonnet 4.5</span>
              </div>
              <span className="text-[9px] text-[#FEB089]/60 bg-[#FEB089]/10 px-2 py-0.5 rounded-full">Napreden</span>
            </div>
            <p className="text-[9px] text-white/30 leading-relaxed">Kompleksne analize, daljša besedila, zahtevne naloge</p>
          </div>
        </div>
        {/* Auto routing indicator */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#FEB089]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            <span className="text-[9px] text-white/40 font-medium">Samodejno usmerjanje</span>
          </div>
          <p className="text-[9px] text-white/25 leading-relaxed">AI analizira zahtevnost in izbere optimalen model za najboljše rezultate</p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.04] rounded-lg p-2 text-center border border-white/[0.06]">
            <span className="text-[14px] font-bold text-white/70">~2s</span>
            <p className="text-[8px] text-white/25 mt-0.5">Hitri odgovori</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2 text-center border border-white/[0.06]">
            <span className="text-[14px] font-bold text-[#FEB089]/70">~8s</span>
            <p className="text-[8px] text-white/25 mt-0.5">Zahtevne naloge</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextGenerateMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Generiranje besedila</span>
        </div>
        {/* Input - just 3 words */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <span className="text-[9px] text-white/30 mb-1 block">Vaša navodila:</span>
          <p className="text-[11px] text-white/70 font-medium">Trajnostna modna znamka</p>
        </div>
        {/* Generated output - full article */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-[#FEB089]/15 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Generiran blog članek</span>
          </div>
          <p className="text-[11px] text-white/60 font-semibold mb-1.5">Zakaj je trajnostna moda prihodnost?</p>
          <p className="text-[10px] text-white/40 leading-[1.7]">
            V svetu hitre mode se vse več potrošnikov obrača k trajnostnim alternativam. Trajnostna moda ni le trend — je nujnost za prihodnost našega planeta.
          </p>
          <p className="text-[10px] text-white/40 leading-[1.7] mt-1.5">
            Naša blagovna znamka se zavzema za etično proizvodnjo, naravne materiale in pravične delovne pogoje...
          </p>
        </div>
        {/* Word count */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-white/20">3 besede → 487 besed</span>
          <span className="text-[9px] text-[#FEB089]/40">60 sekund</span>
        </div>
      </div>
    </div>
  );
}

function CopywritingMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Copywriting formule</span>
        </div>
        {/* Formula selector */}
        <div className="flex gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-[#FEB089]/20 text-[#FEB089] border border-[#FEB089]/20 font-medium">AIDA</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/30">PAS</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/30">BAB</span>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-white/[0.06] text-white/30">4P</span>
        </div>
        {/* AIDA breakdown */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {[
            { letter: "A", label: "Pozornost", text: "Ali veste, da 73% strank zapusti košarico?", color: "#FEB089" },
            { letter: "I", label: "Zanimanje", text: "Naša rešitev zmanjša opustitev za 40% v 30 dneh.", color: "#EE94B0" },
            { letter: "D", label: "Želja", text: "Predstavljajte si 40% več zaključenih nakupov...", color: "#D797A6" },
            { letter: "A", label: "Akcija", text: "Začnite brezplačno — brez kreditne kartice.", color: "#EFBC9F" },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-[#171717]" style={{ backgroundColor: item.color }}>{item.letter}</span>
                <span className="text-[9px] text-white/50 font-medium">{item.label}</span>
              </div>
              <p className="text-[9px] text-white/40 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageRightsMockup() {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  ];

  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Vaše slike, vaša last</span>
        </div>
        {/* Image with ownership badge */}
        <div className="grid grid-cols-3 gap-2">
          {gradients.map((bg, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/[0.06] relative" style={{ background: bg }}>
              <div className="absolute bottom-1 right-1 bg-black/60 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[7px] text-green-400/80">Vaše</span>
              </div>
            </div>
          ))}
        </div>
        {/* Rights info */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] space-y-2">
          {[
            { icon: "✓", text: "Polno lastništvo vseh slik" },
            { icon: "✓", text: "Komercialna uporaba brez omejitev" },
            { icon: "✓", text: "Brez licenčnih stroškov" },
            { icon: "✓", text: "Uporaba na spletu, v tisku, oglasih" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-[10px] text-green-400">{item.icon}</span>
              <span className="text-[9px] text-white/50">{item.text}</span>
            </div>
          ))}
        </div>
        {/* Download actions */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gradient-to-r from-[#FFB288] to-[#EE94B0] rounded-lg flex items-center justify-center">
            <span className="text-[9px] font-semibold text-[#171717]">Prenesi PNG</span>
          </div>
          <div className="h-8 px-3 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center">
            <span className="text-[9px] text-white/30">Deli</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToneAdjustMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Prilagajanje tona</span>
        </div>
        {/* Tone selector */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: "Formalno", active: false },
            { label: "Sproščeno", active: true },
            { label: "Prepričljivo", active: false },
            { label: "Tehnično", active: false },
          ].map((btn) => (
            <div
              key={btn.label}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-medium ${
                btn.active
                  ? "bg-[#FEB089]/20 text-[#FEB089] border border-[#FEB089]/20"
                  : "bg-white/[0.05] text-white/30 border border-white/[0.06]"
              }`}
            >
              {btn.label}
            </div>
          ))}
        </div>
        {/* Original */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
          <span className="text-[9px] text-white/25 block mb-1">Izvirno besedilo:</span>
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Spoštovani, obveščamo vas, da je vaša naročnina bila uspešno obdelana. Zahvaljujemo se vam za zaupanje.
          </p>
        </div>
        {/* Transformed */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-[#FEB089]/15">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-[#FEB089]" />
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Sproščen ton</span>
          </div>
          <p className="text-[10px] text-white/50 leading-[1.7]">
            Hej! Tvoja naročnina je potrjena — vse je urejeno! Hvala, da si z nami. Če potrebuješ karkoli, smo tu zate! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

function LanguagesMockup() {
  const langs = [
    { flag: "🇸🇮", name: "Slovenščina", active: true },
    { flag: "🇬🇧", name: "Angleščina", active: false },
    { flag: "🇩🇪", name: "Nemščina", active: false },
    { flag: "🇫🇷", name: "Francoščina", active: false },
    { flag: "🇮🇹", name: "Italijanščina", active: false },
    { flag: "🇪🇸", name: "Španščina", active: false },
  ];

  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">6 jezikov</span>
        </div>
        {/* Language grid */}
        <div className="grid grid-cols-2 gap-2">
          {langs.map((lang) => (
            <div
              key={lang.name}
              className={`rounded-xl p-3 flex items-center gap-2.5 border ${
                lang.active
                  ? "bg-[#FEB089]/10 border-[#FEB089]/20"
                  : "bg-white/[0.04] border-white/[0.06]"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className={`text-[10px] font-medium ${lang.active ? "text-[#FEB089]" : "text-white/50"}`}>{lang.name}</span>
            </div>
          ))}
        </div>
        {/* Translation direction indicator */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <span className="text-[9px] text-white/25 block mb-2">Primer prevoda:</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50">🇸🇮 Slovenščina</span>
            <span className="text-white/20">→</span>
            <span className="text-[10px] text-white/50">🇩🇪 Nemščina</span>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 bg-white/[0.04] rounded-lg p-2 border border-white/[0.06]">
              <p className="text-[9px] text-white/40">Dobrodošli v naši trgovini</p>
            </div>
            <div className="flex-1 bg-[#FEB089]/[0.05] rounded-lg p-2 border border-[#FEB089]/10">
              <p className="text-[9px] text-[#FEB089]/50">Willkommen in unserem Geschäft</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InpaintingResultMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-white/80">Rezultat inpaintinga</span>
        </div>
        {/* Before / After */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1e2030] to-[#181825] flex flex-col items-center justify-center border border-white/[0.08] relative overflow-hidden">
            <span className="text-[9px] text-white/30 mb-2 font-medium">Pred</span>
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-white/[0.04] to-white/[0.02] flex items-center justify-center relative">
              <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {/* Mask overlay */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-dashed border-[#FEB089]/30 bg-[#FEB089]/10" />
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1a2030] to-[#131825] flex flex-col items-center justify-center border border-[#FEB089]/15 relative overflow-hidden">
            <span className="text-[9px] text-[#FEB089]/50 mb-2 font-medium">Po</span>
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FEB089]/[0.06] to-[#EE94B0]/[0.04] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#FEB089]/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Prompt used */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
          <span className="text-[9px] text-white/25 block mb-1">Opis:</span>
          <p className="text-[10px] text-white/50">&ldquo;Dodaj cvetlični venček na označeno območje&rdquo;</p>
        </div>
        {/* Download */}
        <div className="h-9 rounded-lg bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center justify-center">
          <span className="text-[10px] font-semibold text-[#171717]">Prenesi rezultat</span>
        </div>
      </div>
    </div>
  );
}

const mockupComponents: Record<MockupType, React.FC> = {
  chat: ChatMockup,
  "chat-writing": ChatWritingMockup,
  "model-routing": ModelRoutingMockup,
  templates: TemplatesMockup,
  "text-generate": TextGenerateMockup,
  copywriting: CopywritingMockup,
  gallery: GalleryMockup,
  "image-rights": ImageRightsMockup,
  editor: EditorMockup,
  "tone-adjust": ToneAdjustMockup,
  translator: TranslatorMockup,
  languages: LanguagesMockup,
  "audio-tts": AudioTTSMockup,
  "audio-stt": AudioSTTMockup,
  vision: VisionMockup,
  canvas: CanvasMockup,
  "inpainting-result": InpaintingResultMockup,
  compare: CompareMockup,
  upload: UploadMockup,
  converter: ConverterMockup,
};

export function DashboardMockup({
  screenshotKey,
}: {
  screenshotKey: string;
}) {
  const type = screenshotKeyToType[screenshotKey] || "chat";
  const Component = mockupComponents[type];

  return (
    <div className="w-full h-full bg-[#171717] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40">
      <Component />
    </div>
  );
}

/** Full dashboard preview with sidebar — used on homepage */
export function DashboardPreview() {
  const sidebarItems = [
    { icon: "💬", label: "AI Chat", active: true },
    { icon: "📝", label: "AI Besedila", active: false },
    { icon: "🖼️", label: "AI Grafika", active: false },
    { icon: "📄", label: "AI Dokumenti", active: false },
    { icon: "🌐", label: "AI Prevajalnik", active: false },
    { icon: "🔊", label: "AI Zvok", active: false },
    { icon: "👁️", label: "Računalniški vid", active: false },
    { icon: "🎨", label: "AI Inpainting", active: false },
    { icon: "🔄", label: "Najdi in spremeni", active: false },
    { icon: "🧠", label: "AI Spomin", active: false },
    { icon: "⚙️", label: "Pretvorniki", active: false },
  ];

  return (
    <div className="w-full bg-[#171717] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
      <WindowBar />
      <div className="flex" style={{ height: 380 }}>
        {/* Sidebar */}
        <div className="w-48 shrink-0 border-r border-white/[0.06] bg-[#191919] py-3 px-2 flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="px-3 mb-4">
            <span className="text-[13px] font-bold bg-gradient-to-r from-[#EFBC9F] via-[#D797A6] to-[#FF9ED1] bg-clip-text text-transparent">1984</span>
          </div>
          {/* Nav items */}
          <div className="space-y-0.5 flex-1 overflow-hidden">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] ${
                  item.active
                    ? "bg-white/[0.06] text-white/80 font-medium"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {/* Plan badge */}
          <div className="mt-2 mx-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#FFB288]/10 to-[#EE94B0]/10 border border-[#FEB089]/15">
            <span className="text-[9px] text-[#FEB089]/60 font-medium">Profesionalno</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[12px] font-bold text-white/70">€24,90</span>
              <span className="text-[8px] text-white/20">/mesec</span>
            </div>
          </div>
        </div>
        {/* Main content — chat mockup */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-2 border-b border-white/[0.06]">
            <span className="text-[13px] font-semibold text-white/80">AI Chat</span>
            <p className="text-[10px] text-white/25 mt-0.5">Pogovarjajte se z AI v slovenščini</p>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            <div className="flex justify-end">
              <div className="bg-[#FEB089]/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[70%] border border-[#FEB089]/10">
                <p className="text-[11px] text-[#FEB089]/80 leading-relaxed">
                  Napiši mi 3 predloge za marketinško kampanjo za novo kavno znamko.
                </p>
              </div>
            </div>
            <div className="flex justify-start gap-2">
              <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-[#FEB089]/30 to-[#EE94B0]/30 flex items-center justify-center mt-0.5">
                <span className="text-[8px] text-white/60 font-bold">AI</span>
              </div>
              <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] border border-white/[0.06]">
                <p className="text-[11px] text-white/70 leading-relaxed">
                  <span className="font-semibold">1. &ldquo;Jutranja rutina, nova zgodba&rdquo;</span> — Kampanja, ki poudarja, da vsako jutro zasluži posebno kavo. Fokus na ritualu in kakovosti zrn.
                </p>
                <p className="text-[11px] text-white/70 leading-relaxed mt-2">
                  <span className="font-semibold">2. &ldquo;Od zrna do skodelice&rdquo;</span> — Transparentnost izvora, etična pridelava in direktna trgovina s pridelovalci.
                </p>
                <p className="text-[11px] text-white/70 leading-relaxed mt-2">
                  <span className="font-semibold">3. &ldquo;Okusi Slovenijo&rdquo;</span> — Lokalna znamka z globalnim okusom. Poudari slovensko kakovost...
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-4 py-3 border border-white/[0.08]">
              <span className="flex-1 text-[11px] text-white/20">Vprašajte karkoli...</span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFB288] to-[#EE94B0] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#171717]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L18 12M12 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
