"use client";

import { useState, useRef } from "react";
import {
  ArrowRightLeft,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  FileJson,
  FileSpreadsheet,
  Code,
  Loader2,
} from "lucide-react";

type ConversionType =
  | "img-format"
  | "svg-png"
  | "txt-pdf"
  | "md-html"
  | "html-txt"
  | "json-csv"
  | "csv-json"
  | "xlsx-csv"
  | "csv-xlsx"
  | "xlsx-json"
  | "json-xlsx"
  | "xml-json"
  | "json-xml";

type ConversionGroup = {
  label: string;
  items: {
    id: ConversionType;
    label: string;
    from: string;
    to: string;
    accept: string;
    icon: typeof FileText;
  }[];
};

const groups: ConversionGroup[] = [
  {
    label: "Slike",
    items: [
      {
        id: "img-format",
        label: "Pretvorba slike",
        from: "PNG/JPG/WebP",
        to: "PNG/JPG/WebP",
        accept: "image/png,image/jpeg,image/webp",
        icon: ImageIcon,
      },
      {
        id: "svg-png",
        label: "SVG v PNG",
        from: "SVG",
        to: "PNG",
        accept: ".svg",
        icon: ImageIcon,
      },
    ],
  },
  {
    label: "Dokumenti",
    items: [
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
        id: "html-txt",
        label: "HTML v besedilo",
        from: "HTML",
        to: "TXT",
        accept: ".html,.htm",
        icon: FileText,
      },
    ],
  },
  {
    label: "Tabele",
    items: [
      {
        id: "xlsx-csv",
        label: "Excel v CSV",
        from: "XLSX",
        to: "CSV",
        accept: ".xlsx,.xls",
        icon: FileSpreadsheet,
      },
      {
        id: "csv-xlsx",
        label: "CSV v Excel",
        from: "CSV",
        to: "XLSX",
        accept: ".csv",
        icon: FileSpreadsheet,
      },
      {
        id: "xlsx-json",
        label: "Excel v JSON",
        from: "XLSX",
        to: "JSON",
        accept: ".xlsx,.xls",
        icon: FileSpreadsheet,
      },
      {
        id: "json-xlsx",
        label: "JSON v Excel",
        from: "JSON",
        to: "XLSX",
        accept: ".json",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    label: "Podatki",
    items: [
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
      {
        id: "xml-json",
        label: "XML v JSON",
        from: "XML",
        to: "JSON",
        accept: ".xml",
        icon: Code,
      },
      {
        id: "json-xml",
        label: "JSON v XML",
        from: "JSON",
        to: "XML",
        accept: ".json",
        icon: Code,
      },
    ],
  },
];

const allConversions = groups.flatMap((g) => g.items);

export default function PretvornikiPage() {
  const [selected, setSelected] = useState<ConversionType>("img-format");
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = allConversions.find((c) => c.id === selected)!;

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
        case "svg-png":
          await convertSvgToPng();
          break;
        case "txt-pdf":
          await convertTxtToPdf();
          break;
        case "md-html":
          await convertMdToHtml();
          break;
        case "html-txt":
          await convertHtmlToTxt();
          break;
        case "json-csv":
          await convertJsonToCsv();
          break;
        case "csv-json":
          await convertCsvToJson();
          break;
        case "xlsx-csv":
          await convertXlsxToCsv();
          break;
        case "csv-xlsx":
          await convertCsvToXlsx();
          break;
        case "xlsx-json":
          await convertXlsxToJson();
          break;
        case "json-xlsx":
          await convertJsonToXlsx();
          break;
        case "xml-json":
          await convertXmlToJson();
          break;
        case "json-xml":
          await convertJsonToXml();
          break;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Napaka pri pretvorbi"
      );
    }

    setLoading(false);
  }

  // --- Image conversions ---

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

  async function convertSvgToPng() {
    const svgText = await file!.text();
    const img = new Image();

    // Parse SVG dimensions
    const widthMatch = svgText.match(/width="(\d+)"/);
    const heightMatch = svgText.match(/height="(\d+)"/);
    const viewBoxMatch = svgText.match(
      /viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/
    );

    let w = 800,
      h = 600;
    if (widthMatch && heightMatch) {
      w = parseInt(widthMatch[1]);
      h = parseInt(heightMatch[1]);
    } else if (viewBoxMatch) {
      w = Math.round(parseFloat(viewBoxMatch[1]));
      h = Math.round(parseFloat(viewBoxMatch[2]));
    }

    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Napaka pri nalaganju SVG"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);

    const pngBlob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );

    const name = file!.name.replace(/\.[^.]+$/, ".png");
    setResultUrl(URL.createObjectURL(pngBlob));
    setResultName(name);
    URL.revokeObjectURL(url);
  }

  // --- Document conversions ---

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

    let html = md
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
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

  async function convertHtmlToTxt() {
    const html = await file!.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const text = doc.body.textContent || doc.body.innerText || "";

    const blob = new Blob([text.trim()], { type: "text/plain" });
    const name = file!.name.replace(/\.[^.]+$/, ".txt");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  // --- Spreadsheet conversions ---

  async function convertXlsxToCsv() {
    const XLSX = await import("xlsx");
    const buffer = await file!.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);

    const blob = new Blob([csv], { type: "text/csv" });
    const name = file!.name.replace(/\.[^.]+$/, ".csv");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertCsvToXlsx() {
    const XLSX = await import("xlsx");
    const text = await file!.text();
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(
      text
        .trim()
        .split("\n")
        .map((row) => parseCsvLine(row))
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const xlsxBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([xlsxBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const name = file!.name.replace(/\.[^.]+$/, ".xlsx");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertXlsxToJson() {
    const XLSX = await import("xlsx");
    const buffer = await file!.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const name = file!.name.replace(/\.[^.]+$/, ".json");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertJsonToXlsx() {
    const XLSX = await import("xlsx");
    const text = await file!.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("JSON mora biti polje objektov");
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const xlsxBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([xlsxBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const name = file!.name.replace(/\.[^.]+$/, ".xlsx");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  // --- Data conversions ---

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

  async function convertXmlToJson() {
    const xml = await file!.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      throw new Error("Neveljavna XML datoteka");
    }

    function nodeToObj(node: Element): Record<string, unknown> {
      const obj: Record<string, unknown> = {};

      // Attributes
      if (node.attributes.length > 0) {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < node.attributes.length; i++) {
          attrs[node.attributes[i].name] = node.attributes[i].value;
        }
        obj["@attributes"] = attrs;
      }

      // Child nodes
      const children = Array.from(node.children);
      if (children.length === 0) {
        const text = node.textContent?.trim();
        if (text) obj["#text"] = text;
      } else {
        for (const child of children) {
          const childName = child.tagName;
          const childObj = nodeToObj(child);
          const simplified =
            Object.keys(childObj).length === 1 && "#text" in childObj
              ? childObj["#text"]
              : childObj;

          if (childName in obj) {
            const existing = obj[childName];
            if (Array.isArray(existing)) {
              existing.push(simplified);
            } else {
              obj[childName] = [existing, simplified];
            }
          } else {
            obj[childName] = simplified;
          }
        }
      }

      return obj;
    }

    const result = { [doc.documentElement.tagName]: nodeToObj(doc.documentElement) };
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const name = file!.name.replace(/\.[^.]+$/, ".json");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  async function convertJsonToXml() {
    const text = await file!.text();
    const data = JSON.parse(text);

    function objToXml(obj: unknown, indent = ""): string {
      if (obj === null || obj === undefined) return "";
      if (typeof obj !== "object") return escapeXml(String(obj));

      if (Array.isArray(obj)) {
        return obj.map((item) => objToXml(item, indent)).join("\n");
      }

      const lines: string[] = [];
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (key === "@attributes" || key === "#text") continue;

        if (Array.isArray(value)) {
          for (const item of value) {
            const inner = objToXml(item, indent + "  ");
            if (typeof item === "object" && item !== null) {
              lines.push(`${indent}<${key}>\n${inner}\n${indent}</${key}>`);
            } else {
              lines.push(`${indent}<${key}>${inner}</${key}>`);
            }
          }
        } else if (typeof value === "object" && value !== null) {
          const inner = objToXml(value, indent + "  ");
          lines.push(`${indent}<${key}>\n${inner}\n${indent}</${key}>`);
        } else {
          lines.push(
            `${indent}<${key}>${escapeXml(String(value ?? ""))}</${key}>`
          );
        }
      }
      return lines.join("\n");
    }

    function escapeXml(s: string): string {
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    // Determine root element
    const keys = Object.keys(data);
    let xml: string;
    if (keys.length === 1 && typeof data[keys[0]] === "object") {
      xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${keys[0]}>\n${objToXml(data[keys[0]], "  ")}\n</${keys[0]}>`;
    } else {
      xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${objToXml(data, "  ")}\n</root>`;
    }

    const blob = new Blob([xml], { type: "application/xml" });
    const name = file!.name.replace(/\.[^.]+$/, ".xml");
    setResultUrl(URL.createObjectURL(blob));
    setResultName(name);
  }

  // --- Helpers ---

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
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <div
      className="p-8 max-w-4xl relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragging && (
        <div className="absolute inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl pointer-events-none">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[#FEB089]/50">
            <Upload className="w-12 h-12 text-[#FEB089]" />
            <p className="text-lg text-[#FEB089] font-medium">
              Spustite datoteko za pretvorbo
            </p>
            <p className="text-sm text-[#E1E1E1]/40">
              {current.from}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-white">Pretvorniki</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Pretvorite datoteke med različnimi formati — 13 pretvorb, vse brezplačno
      </p>

      {/* Conversion type selector — grouped */}
      <div className="mt-8 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs text-[#E1E1E1]/30 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {group.items.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelected(c.id);
                    resetState();
                  }}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-center transition-colors duration-200 ${
                    selected === c.id
                      ? "bg-white/[0.08] text-white border border-[#FEB089]/30"
                      : "bg-white/[0.03] text-[#E1E1E1]/50 border border-white/[0.06] hover:bg-white/[0.05]"
                  }`}
                >
                  <c.icon className="w-4 h-4" />
                  <span className="text-xs">{c.label}</span>
                  <span className="text-[10px] text-[#E1E1E1]/30">
                    {c.from} → {c.to}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload & Convert */}
      <div className="mt-6 glass-card rounded-xl p-6 space-y-4">
        {file ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.06] transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              {file.name}
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 px-4 py-8 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.08] cursor-pointer hover:bg-white/[0.04] hover:border-[#FEB089]/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#FEB089]/50" />
            </div>
            <p className="text-sm text-[#E1E1E1]/50 text-center">
              Povlecite datoteko sem ali kliknite za nalaganje
            </p>
            <p className="text-xs text-[#E1E1E1]/30">
              {current.from} datoteka
            </p>
          </div>
        )}
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
          {loading ? "Pretvarjam..." : "Pretvori"}
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
