/**
 * Realistic CSS-based dashboard mockup component for feature detail pages.
 * Renders high-fidelity dark-themed dashboard previews with real Slovenian text.
 */

type MockupType =
  | "chat"
  | "templates"
  | "gallery"
  | "editor"
  | "translator"
  | "audio-tts"
  | "audio-stt"
  | "vision"
  | "canvas"
  | "compare"
  | "upload"
  | "converter";

const screenshotKeyToType: Record<string, MockupType> = {
  "ai-chat-conversation": "chat",
  "ai-besedila-templates": "templates",
  "ai-grafika-gallery": "gallery",
  "ai-grafika-manage": "gallery",
  "ai-dokumenti-edit": "editor",
  "ai-prevajalnik-translate": "translator",
  "ai-zvok-tts": "audio-tts",
  "ai-zvok-stt": "audio-stt",
  "ai-vid-describe": "vision",
  "ai-vid-ocr": "vision",
  "ai-inpainting-canvas": "canvas",
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

const mockupComponents: Record<MockupType, React.FC> = {
  chat: ChatMockup,
  templates: TemplatesMockup,
  gallery: GalleryMockup,
  editor: EditorMockup,
  translator: TranslatorMockup,
  "audio-tts": AudioTTSMockup,
  "audio-stt": AudioSTTMockup,
  vision: VisionMockup,
  canvas: CanvasMockup,
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
