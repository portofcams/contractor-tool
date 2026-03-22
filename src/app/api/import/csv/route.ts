/**
 * POST /api/import/csv
 *
 * Parses an uploaded CSV file, auto-detects column mappings,
 * and returns headers, rows, and a preview for the user to confirm.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ColumnType =
  | "itemName"
  | "quantity"
  | "unitPrice"
  | "total"
  | "customerName"
  | "date"
  | "invoiceNumber"
  | "description"
  | "unit"
  | "category"
  | "unknown";

const COLUMN_PATTERNS: Record<ColumnType, RegExp> = {
  itemName: /^(item|product|service|product\/service|item name|product name|service name|line item)$/i,
  quantity: /^(qty|quantity|count|units|hours)$/i,
  unitPrice: /^(price|rate|unit price|unit cost|cost|amount|each|per unit|unit amount)$/i,
  total: /^(total|subtotal|line total|line amount|ext\. price|extended|net amount|line price)$/i,
  customerName: /^(customer|client|bill to|customer name|client name|name|company|sold to)$/i,
  date: /^(date|invoice date|order date|created|issued|trans\. date|transaction date)$/i,
  invoiceNumber: /^(invoice|invoice #|invoice number|number|ref|reference|order|order #|doc number)$/i,
  description: /^(description|memo|notes|details|line description|item description)$/i,
  unit: /^(unit|uom|unit of measure|measure)$/i,
  category: /^(category|type|class|group|department)$/i,
  unknown: /^$/,
};

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Detect delimiter: comma, tab, semicolon, pipe
  const firstLine = lines[0];
  const delimiters = [",", "\t", ";", "|"];
  let delimiter = ",";
  let maxCount = 0;
  for (const d of delimiters) {
    const count = firstLine.split(d).length;
    if (count > maxCount) {
      maxCount = count;
      delimiter = d;
    }
  }

  function parseLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          fields.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
    }
    fields.push(current.trim());
    return fields;
  }

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);

  return { headers, rows };
}

function detectColumnMapping(headers: string[]): Record<number, ColumnType> {
  const mapping: Record<number, ColumnType> = {};

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].trim();
    let matched: ColumnType = "unknown";

    for (const [type, pattern] of Object.entries(COLUMN_PATTERNS)) {
      if (type === "unknown") continue;
      if (pattern.test(header)) {
        matched = type as ColumnType;
        break;
      }
    }

    // Fuzzy fallbacks for common formats
    if (matched === "unknown") {
      const lower = header.toLowerCase();
      if (lower.includes("item") || lower.includes("product") || lower.includes("service")) {
        matched = "itemName";
      } else if (lower.includes("qty") || lower.includes("quantity")) {
        matched = "quantity";
      } else if (lower.includes("price") || lower.includes("rate") || lower.includes("cost")) {
        matched = "unitPrice";
      } else if (lower.includes("total") || lower.includes("amount")) {
        matched = "total";
      } else if (lower.includes("customer") || lower.includes("client")) {
        matched = "customerName";
      } else if (lower.includes("date")) {
        matched = "date";
      } else if (lower.includes("invoice") || lower.includes("ref")) {
        matched = "invoiceNumber";
      } else if (lower.includes("desc") || lower.includes("memo") || lower.includes("note")) {
        matched = "description";
      } else if (lower.includes("category") || lower.includes("class") || lower.includes("type")) {
        matched = "category";
      }
    }

    mapping[i] = matched;
  }

  return mapping;
}

function detectSource(headers: string[]): string {
  const joined = headers.join(" ").toLowerCase();
  if (joined.includes("product/service") && joined.includes("memo/description")) return "quickbooks";
  if (joined.includes("item name") && joined.includes("wix")) return "wix";
  if (joined.includes("square") || (joined.includes("item") && joined.includes("gross sales"))) return "square";
  if (joined.includes("freshbooks") || (joined.includes("client") && joined.includes("paid date"))) return "freshbooks";
  if (joined.includes("xero") || joined.includes("branding theme")) return "xero";
  if (joined.includes("wave") || joined.includes("account name")) return "wave";
  return "generic";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Validate file type
  const name = file.name.toLowerCase();
  if (!name.endsWith(".csv") && !name.endsWith(".tsv") && !name.endsWith(".txt")) {
    return NextResponse.json(
      { error: "Unsupported file format. Please upload a CSV file." },
      { status: 400 }
    );
  }

  // Size limit: 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  const text = await file.text();
  const { headers, rows } = parseCSV(text);

  if (headers.length === 0) {
    return NextResponse.json({ error: "File appears empty or has no headers" }, { status: 400 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "File has headers but no data rows" }, { status: 400 });
  }

  const columnMapping = detectColumnMapping(headers);
  const source = detectSource(headers);
  const previewRows = rows.slice(0, 10);

  return NextResponse.json({
    headers,
    rows,
    columnMapping,
    previewRows,
    totalRows: rows.length,
    detectedSource: source,
  });
}
