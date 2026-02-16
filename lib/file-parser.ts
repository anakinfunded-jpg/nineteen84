const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_OUTPUT_CHARS = 200_000;

type ParseResult = {
  text: string;
  pageCount?: number;
};

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".pptx",
  ".xlsx",
  ".txt",
  ".md",
  ".csv",
  ".json",
];

export function getSupportedExtensions(): string[] {
  return SUPPORTED_EXTENSIONS;
}

export async function parseFile(file: File): Promise<ParseResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Datoteka je prevelika. Največja velikost je 20 MB.");
  }

  const name = file.name.toLowerCase();
  const ext = name.slice(name.lastIndexOf("."));

  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `Nepodprt format datoteke (${ext}). Podprti formati: ${SUPPORTED_EXTENSIONS.join(", ")}`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let result: ParseResult;

  switch (ext) {
    case ".pdf":
      result = await parsePdf(buffer);
      break;
    case ".docx":
      result = await parseDocx(buffer);
      break;
    case ".pptx":
      result = await parsePptx(buffer);
      break;
    case ".xlsx":
      result = await parseXlsx(buffer);
      break;
    default:
      result = { text: buffer.toString("utf-8") };
  }

  if (result.text.length > MAX_OUTPUT_CHARS) {
    result.text = result.text.slice(0, MAX_OUTPUT_CHARS);
  }

  if (!result.text.trim()) {
    throw new Error(
      "Datoteka ne vsebuje besedila ali pa ga ni mogoče izvleči."
    );
  }

  return result;
}

async function parsePdf(buffer: Buffer): Promise<ParseResult> {
  try {
    // pdf-parse uses `export =` (CJS) — dynamic import gives { default: fn }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (
      buf: Buffer
    ) => Promise<{ text: string; numpages: number }>;
    const data = await pdfParse(buffer);
    return { text: data.text, pageCount: data.numpages };
  } catch {
    throw new Error(
      "Napaka pri branju PDF datoteke. Preverite, da datoteka ni zaščitena ali poškodovana."
    );
  }
}

async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value };
  } catch {
    throw new Error(
      "Napaka pri branju DOCX datoteke. Preverite, da je datoteka veljavna."
    );
  }
}

async function parsePptx(buffer: Buffer): Promise<ParseResult> {
  try {
    const AdmZip = (await import("adm-zip")).default;
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    const slideEntries = entries
      .filter((e) => /^ppt\/slides\/slide\d+\.xml$/i.test(e.entryName))
      .sort((a, b) => {
        const numA = parseInt(a.entryName.match(/slide(\d+)/)?.[1] || "0");
        const numB = parseInt(b.entryName.match(/slide(\d+)/)?.[1] || "0");
        return numA - numB;
      });

    if (slideEntries.length === 0) {
      throw new Error("V PPTX datoteki ni najdenih diapozitivov.");
    }

    const texts: string[] = [];
    for (const entry of slideEntries) {
      const xml = entry.getData().toString("utf-8");
      const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g);
      if (matches) {
        const slideText = matches
          .map((m) => m.replace(/<\/?a:t>/g, ""))
          .join(" ");
        texts.push(slideText);
      }
    }

    return { text: texts.join("\n\n"), pageCount: slideEntries.length };
  } catch (err) {
    if (err instanceof Error && err.message.includes("PPTX")) throw err;
    throw new Error(
      "Napaka pri branju PPTX datoteke. Preverite, da je datoteka veljavna."
    );
  }
}

async function parseXlsx(buffer: Buffer): Promise<ParseResult> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const texts: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (csv.trim()) {
        texts.push(`--- ${sheetName} ---\n${csv}`);
      }
    }

    return { text: texts.join("\n\n") };
  } catch {
    throw new Error(
      "Napaka pri branju XLSX datoteke. Preverite, da je datoteka veljavna."
    );
  }
}
