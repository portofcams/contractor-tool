/**
 * POST /api/customers/import
 *
 * Import customers from a CSV file.
 * Expected columns: name, email, phone, address, notes
 * First row is treated as headers (case-insensitive matching).
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No data rows found in CSV" }, { status: 400 });
  }

  // Map column names flexibly
  function getValue(row: Record<string, string>, ...keys: string[]): string {
    for (const key of keys) {
      if (row[key]) return row[key];
    }
    return "";
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = getValue(row, "name", "customer name", "customer", "company", "company name");

    if (!name) {
      skipped++;
      continue;
    }

    const email = getValue(row, "email", "e-mail", "email address");
    const phone = getValue(row, "phone", "telephone", "phone number", "mobile", "cell");
    const address = getValue(row, "address", "street address", "location");
    const notes = getValue(row, "notes", "note", "comments", "comment");

    // Skip exact duplicates (same name + email)
    if (email) {
      const existing = await prisma.customer.findFirst({
        where: {
          contractorId: session.user.id,
          name,
          email,
        },
      });
      if (existing) {
        skipped++;
        continue;
      }
    }

    try {
      await prisma.customer.create({
        data: {
          contractorId: session.user.id,
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          notes: notes || null,
        },
      });
      imported++;
    } catch (err) {
      errors.push(`Row ${i + 2}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    imported,
    skipped,
    total: rows.length,
    errors: errors.slice(0, 5),
  });
}
