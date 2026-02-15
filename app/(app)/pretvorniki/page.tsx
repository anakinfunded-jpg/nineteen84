"use client";

import { useState, useRef } from "react";
import {
  ArrowRightLeft,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  FileJson,
  Loader2,
} from "lucide-react";

type ConversionType =
  | "img-format"
  | "txt-pdf"
  | "md-html"
  | "json-csv"
  | "csv-json";

const conversions: {
  id: ConversionType;
  label: string;
  from: string;
  to: string;
  accept: string;
  icon: typeof FileText;
}[] = [
  {
    id: "img-format",
    label: "Pretvorba slike",
    from: "PNG/JPG/WebP",
    to: "PNG/JPG/WebP",
    accept: "image/png,image/jpeg,image/webp",
    icon: ImageIcon,
  },
  {
    id: "txt-pdf",
    label: "Besedilo v PDF",
    from: "TXT",
    to: "PDF",
    accept: ".txt",
    icon: FileText,
  },
  {
    id: "md-html",
    label: "Markdown v HTML",
    from: "MD",
    to: "HTML",
    accept: ".md",
    icon: FileText,
  },
  {
    id: "json-csv",
    label: "JSON v CSV",
    from: "JSON",
    to: "CSV",
    accept: ".json",
    icon: FileJson,
  },
  {
    id: "csv-json",
    label: "CSV v JSON",
    from: "CSV",
    to: "JSON",
    accept: ".csv",
    icon: FileJson,
  },
];

export default function PretvornikiPage() {
  const [selected, setSelected] = useState<ConversionType>("img-format");
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const current = conversions.find((c) => c.id === selected)!;

  function handleFile(f: File) {
    setFile(f);
    setError("");
    setResultUrl(null);
  }

  function resetState() {
    setFile(null);
    setError("");
    setResultUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleConvert() {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setResultUrl(null);

    try {
      switch (selected) {
        case "img-format":
          await convertImage();
          break;
        case "txt-pdf":
          await convertTxtToPdf();
          break;
        case "md-html":
          await convertMdToHtml();
          break;
        case "json-csv":
          await convertJsonToCsv();
          break;
        case "csv-json":
          await convertCsvToJson();
          break;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Napaka pri pretvorbi"
      );
    }

    setLoading(false);
  }

  async function convertImage() {
    const img = new Image();
    const url = URL.createObjectURL(file!);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Napaka pri nalaganju slike"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const mimeTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      webp: "image/webp",
    };

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), mimeTypes[outputFormat], 0.92)
    );

    const name = file!.name.replace(/\.[^.]+$/, `.${outputFormat}`);
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
    URL.revokeObjectURL(url);
  }

  async function convertTxtToPdf() {
    const { jsPDF } = await import("jspdf");
    const text = await file!.text();
    const doc = new jsPDF();

    const lines = doc.splitTextToSize(text, 180);
    let y = 15;

    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, 15, y);
      y += 7;
    }

    const blob = doc.output("blob");
    const name = file!.name.replace(/\.[^.]+$/, ".pdf");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertMdToHtml() {
    const md = await file!.text();

    // Simple markdown to HTML conversion
    let html = md
      // Headers
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");

    html = `<!DOCTYPE html>
<html lang="sl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${file!.name.replace(/\.[^.]+$/, "")}</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
</style>
</head>
<body>
<p>${html}</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const name = file!.name.replace(/\.[^.]+$/, ".html");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertJsonToCsv() {
    const text = await file!.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("JSON mora biti polje objektov");
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? "" : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      });
      csvRows.push(values.join(","));
    }

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const name = file!.name.replace(/\.[^.]+$/, ".csv");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertCsvToJson() {
    const text = await file!.text();
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      throw new Error("CSV mora imeti vsaj glavo in eno vrstico podatkov");
    }

    const headers = parseCsvLine(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || "";
      });
      result.push(obj);
    }

    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const name = file!.name.replace(/\.[^.]+$/, ".json");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
    }
    result.push(current);
    return result;
  }

  function handleDownload() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Pretvorniki</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Pretvorite datoteke med različnimi formati
      </p>

      {/* Conversion type selector */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {conversions.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelected(c.id);
              resetState();
            }}
            className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-center transition-colors duration-200 ${
              selected === c.id
                ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
                : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
            }`}
          >
            <c.icon className="w-5 h-5" />
            <span className="text-xs">{c.label}</span>
            <span className="text-[10px] text-[#E1E1E1]/30">
              {c.from} → {c.to}
            </span>
          </button>
        ))}
      </div>

      {/* Upload & Convert */}
      <div className="mt-6 glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.06] transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            {file ? file.name : `Naložite ${current.from} datoteko`}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={current.accept}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
        </div>

        {/* Output format selector for image conversions */}
        {selected === "img-format" && file && (
          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Ciljni format
            </label>
            <div className="flex gap-2">
              {["png", "jpg", "webp"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`px-4 py-2 rounded-xl text-sm uppercase transition-colors ${
                    outputFormat === fmt
                      ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
                      : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="w-full cta-button py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRightLeft className="w-4 h-4" />
          )}
          {loading ? "Pretvarja..." : "Pretvori"}
        </button>
      </div>

      {/* Result */}
      {resultUrl && (
        <div className="mt-4 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">{resultName}</p>
              <p className="text-xs text-[#E1E1E1]/30 mt-0.5">
                Pretvorba uspešna
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#E1E1E1] text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Prenesi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
