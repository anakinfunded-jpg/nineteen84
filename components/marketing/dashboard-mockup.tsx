/**
 * CSS-based dashboard mockup component for feature detail pages.
 * Renders a realistic-looking dark-themed dashboard preview.
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

function Dot({ color = "#FEB089" }: { color?: string }) {
  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function WindowBar() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      <div className="flex-1 mx-8">
        <div className="h-5 bg-white/[0.04] rounded-md max-w-[200px] mx-auto" />
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
          <div className="bg-[#FEB089]/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[70%]">
            <div className="h-2.5 bg-[#FEB089]/30 rounded w-40 mb-1.5" />
            <div className="h-2.5 bg-[#FEB089]/20 rounded w-28" />
          </div>
        </div>
        {/* AI message */}
        <div className="flex justify-start">
          <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%]">
            <div className="flex items-center gap-2 mb-2">
              <Dot />
              <div className="h-2 bg-white/10 rounded w-12" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-white/[0.06] rounded w-full" />
              <div className="h-2.5 bg-white/[0.06] rounded w-[90%]" />
              <div className="h-2.5 bg-white/[0.06] rounded w-[75%]" />
              <div className="h-2.5 bg-white/[0.06] rounded w-[85%]" />
            </div>
          </div>
        </div>
        {/* Another user message */}
        <div className="flex justify-end">
          <div className="bg-[#FEB089]/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[60%]">
            <div className="h-2.5 bg-[#FEB089]/30 rounded w-32" />
          </div>
        </div>
        {/* AI response */}
        <div className="flex justify-start">
          <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%]">
            <div className="flex items-center gap-2 mb-2">
              <Dot />
              <div className="h-2 bg-white/10 rounded w-12" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-white/[0.06] rounded w-full" />
              <div className="h-2.5 bg-white/[0.06] rounded w-[70%]" />
            </div>
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.06]">
          <div className="flex-1 h-3 bg-white/[0.04] rounded" />
          <div className="w-8 h-8 rounded-lg bg-[#FEB089]/20 flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-r-2 border-[#FEB089]/40 rotate-45 -translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatesMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4">
        {/* Search bar */}
        <div className="h-10 bg-white/[0.04] rounded-xl border border-white/[0.06] mb-4" />
        {/* Template grid */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04] hover:border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-[#FEB089]/15" />
                <div className="h-2.5 bg-white/[0.08] rounded w-16" />
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-white/[0.04] rounded w-full" />
                <div className="h-2 bg-white/[0.04] rounded w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4">
        {/* Prompt bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-10 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
          <div className="h-10 px-4 rounded-xl bg-[#FEB089]/20 flex items-center">
            <div className="h-2.5 bg-[#FEB089]/40 rounded w-12" />
          </div>
        </div>
        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(${135 + i * 30}deg, rgba(254,176,137,${0.05 + i * 0.02}), rgba(238,148,176,${0.03 + i * 0.02}))`,
              }}
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
        {/* Toolbar */}
        <div className="flex gap-2">
          {["Izboljšaj", "Skrajšaj", "Podaljšaj"].map((label, i) => (
            <div
              key={label}
              className={`px-3 py-1.5 rounded-lg text-[10px] ${
                i === 0
                  ? "bg-[#FEB089]/20 text-[#FEB089]/60"
                  : "bg-white/[0.04] text-white/20"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        {/* Text area */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="space-y-2">
            <div className="h-2.5 bg-white/[0.06] rounded w-full" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[95%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[88%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-full" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[70%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[92%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[60%]" />
          </div>
        </div>
        {/* Result preview */}
        <div className="flex-1 bg-white/[0.02] rounded-xl p-3 border border-[#FEB089]/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Dot />
            <div className="text-[10px] text-[#FEB089]/40">Rezultat</div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-full" />
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-[90%]" />
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-[82%]" />
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-[95%]" />
          </div>
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
        {/* Language selectors */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/30">Slovenščina</span>
          </div>
          <div className="text-white/20 text-xs">→</div>
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/30">Angleščina</span>
          </div>
        </div>
        {/* Two columns */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-white/[0.08] rounded w-full" />
              <div className="h-2.5 bg-white/[0.08] rounded w-[85%]" />
              <div className="h-2.5 bg-white/[0.08] rounded w-[90%]" />
            </div>
          </div>
          <div className="flex-1 bg-white/[0.02] rounded-xl p-3 border border-[#FEB089]/10">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-[#FEB089]/[0.08] rounded w-full" />
              <div className="h-2.5 bg-[#FEB089]/[0.08] rounded w-[80%]" />
              <div className="h-2.5 bg-[#FEB089]/[0.08] rounded w-[92%]" />
            </div>
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
        {/* Text input */}
        <div className="flex-1 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="space-y-1.5">
            <div className="h-2.5 bg-white/[0.06] rounded w-full" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[80%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[90%]" />
          </div>
        </div>
        {/* Voice selector */}
        <div className="flex gap-2">
          {["Alloy", "Nova", "Echo"].map((v, i) => (
            <div
              key={v}
              className={`px-3 py-2 rounded-lg text-[10px] ${
                i === 0
                  ? "bg-[#FEB089]/20 text-[#FEB089]/60 border border-[#FEB089]/20"
                  : "bg-white/[0.04] text-white/20 border border-white/[0.04]"
              }`}
            >
              {v}
            </div>
          ))}
        </div>
        {/* Audio player */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FEB089]/20 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#FEB089]/40 ml-0.5" />
            </div>
            {/* Waveform */}
            <div className="flex-1 flex items-center gap-0.5 h-8">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#FEB089]/20 rounded-full"
                  style={{
                    height: `${20 + Math.sin(i * 0.8) * 60 + Math.random() * 20}%`,
                  }}
                />
              ))}
            </div>
            <div className="text-[10px] text-white/20">0:12</div>
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
        {/* Upload area */}
        <div className="flex-1 border-2 border-dashed border-white/[0.08] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
            </div>
            <div className="h-2 bg-white/[0.06] rounded w-24 mx-auto mb-1" />
            <div className="h-2 bg-white/[0.04] rounded w-16 mx-auto" />
          </div>
        </div>
        {/* Result */}
        <div className="bg-white/[0.02] rounded-xl p-3 border border-[#FEB089]/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Dot />
            <div className="text-[10px] text-[#FEB089]/40">Prepis</div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-full" />
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-[88%]" />
            <div className="h-2.5 bg-[#FEB089]/[0.06] rounded w-[75%]" />
          </div>
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
        {/* Image preview */}
        <div className="flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.06] flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/10 rounded-lg" />
          </div>
        </div>
        {/* Analysis result */}
        <div className="flex-1 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-3">
            <Dot />
            <div className="text-[10px] text-[#FEB089]/40">Analiza</div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-white/[0.06] rounded w-full" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[92%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[85%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-full" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[70%]" />
            <div className="h-2.5 bg-white/[0.06] rounded w-[88%]" />
          </div>
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
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FEB089]/20 border border-[#FEB089]/20" />
          <div className="flex-1 h-2 bg-white/[0.04] rounded-full">
            <div className="h-full bg-[#FEB089]/30 rounded-full w-1/3" />
          </div>
          <div className="text-[10px] text-white/20">20px</div>
        </div>
        {/* Canvas */}
        <div className="flex-1 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.05] relative overflow-hidden border border-white/[0.06]">
          {/* Simulated brush strokes */}
          <div
            className="absolute top-[30%] left-[25%] w-20 h-12 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(239,68,68,0.3), transparent 70%)",
            }}
          />
          <div
            className="absolute top-[35%] left-[35%] w-16 h-10 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(239,68,68,0.25), transparent 70%)",
            }}
          />
        </div>
        {/* Prompt input */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/20">
              Opiši, kaj naj AI nariše...
            </span>
          </div>
          <div className="h-9 px-3 rounded-lg bg-[#FEB089]/20 flex items-center">
            <div className="h-2 bg-[#FEB089]/40 rounded w-10" />
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
        {/* Find & Replace inputs */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/20">Najdi: rdeč avto</span>
          </div>
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/20">
              Zamenjaj: moder avto
            </span>
          </div>
        </div>
        {/* Before/After */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.04] flex flex-col items-center justify-center">
            <div className="text-[10px] text-white/20 mb-2">Pred</div>
            <div className="w-16 h-16 rounded-lg bg-white/[0.04]" />
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#FEB089]/[0.02] to-[#EE94B0]/[0.04] flex flex-col items-center justify-center border border-[#FEB089]/10">
            <div className="text-[10px] text-[#FEB089]/40 mb-2">Po</div>
            <div className="w-16 h-16 rounded-lg bg-[#FEB089]/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadMockup() {
  return (
    <div className="flex flex-col h-full">
      <WindowBar />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Upload area */}
        <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-4 text-center">
          <div className="h-2 bg-white/[0.06] rounded w-32 mx-auto mb-1" />
          <div className="h-2 bg-white/[0.04] rounded w-20 mx-auto" />
        </div>
        {/* Document list */}
        <div className="space-y-2 flex-1">
          {["Predstavitev podjetja.txt", "Cenik izdelkov.csv", "FAQ.md"].map(
            (doc) => (
              <div
                key={doc}
                className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.04]"
              >
                <div className="w-6 h-6 rounded bg-[#FEB089]/15 flex items-center justify-center">
                  <div className="w-3 h-3 border border-[#FEB089]/30 rounded-sm" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-white/40">{doc}</div>
                </div>
                <div className="text-[10px] text-white/15">2.3 KB</div>
              </div>
            )
          )}
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
        {/* Format selector */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/30">PNG</span>
          </div>
          <div className="text-white/20 text-xs">→</div>
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center px-3">
            <span className="text-[10px] text-white/30">WebP</span>
          </div>
        </div>
        {/* Upload area */}
        <div className="flex-1 border-2 border-dashed border-white/[0.08] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/[0.04]" />
            <div className="h-2 bg-white/[0.06] rounded w-28 mx-auto mb-1" />
            <div className="h-2 bg-white/[0.04] rounded w-20 mx-auto" />
          </div>
        </div>
        {/* Convert button */}
        <div className="h-10 rounded-xl bg-[#FEB089]/20 flex items-center justify-center">
          <div className="h-2.5 bg-[#FEB089]/40 rounded w-16" />
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
    <div className="w-full h-full bg-[#181818] rounded-xl overflow-hidden border border-white/[0.06]">
      <Component />
    </div>
  );
}
