/**
 * POST /api/import/csv/confirm
 *
 * Processes confirmed CSV import: creates price book items, customers, and/or invoices.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

interface ImportRequest {
  rows: string[][];
  columnMapping: Record<string, ColumnType>;
  options: {
    addToPriceBook: boolean;
    createInvoices: boolean;
    importCustomers: boolean;
  };
}

function getField(row: string[], columnMapping: Record<string, ColumnType>, type: ColumnType): string | null {
  for (const [idx, mappedType] of Object.entries(columnMapping)) {
    if (mappedType === type) {
      return row[parseInt(idx)]?.trim() || null;
    }
  }
  return null;
}

function parseNumber(val: string | null): number {
  if (!val) return 0;
  // Remove currency symbols, commas
  const cleaned = val.replace(/[$,\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ImportRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { rows, columnMapping, options } = body;

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows to import" }, { status: 400 });
  }

  if (!columnMapping || typeof columnMapping !== "object") {
    return NextResponse.json({ error: "Column mapping required" }, { status: 400 });
  }

  const contractorId = session.user.id;
  const results = {
    priceBookItems: 0,
    customers: 0,
    invoices: 0,
    errors: [] as string[],
  };

  // Track unique customers to avoid duplicates
  const customerCache = new Map<string, string>(); // name -> id

  // Pre-load existing customers for dedup
  if (options.importCustomers || options.createInvoices) {
    const existing = await prisma.customer.findMany({
      where: { contractorId },
      select: { id: true, name: true },
    });
    for (const c of existing) {
      customerCache.set(c.name.toLowerCase(), c.id);
    }
  }

  // Track unique price book items for dedup
  const priceBookCache = new Set<string>();
  if (options.addToPriceBook) {
    const existing = await prisma.materialCost.findMany({
      where: { contractorId, active: true },
      select: { name: true, materialType: true },
    });
    for (const m of existing) {
      priceBookCache.add(`${m.name.toLowerCase()}|${m.materialType.toLowerCase()}`);
    }
  }

  // Get invoice count for numbering
  let invoiceCount = 0;
  if (options.createInvoices) {
    invoiceCount = await prisma.invoice.count({ where: { contractorId } });
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Import customers
      if (options.importCustomers) {
        const customerName = getField(row, columnMapping, "customerName");
        if (customerName && !customerCache.has(customerName.toLowerCase())) {
          const customer = await prisma.customer.create({
            data: {
              contractorId,
              name: customerName,
            },
          });
          customerCache.set(customerName.toLowerCase(), customer.id);
          results.customers++;
        }
      }

      // Add to price book
      if (options.addToPriceBook) {
        const itemName = getField(row, columnMapping, "itemName");
        const unitPrice = parseNumber(getField(row, columnMapping, "unitPrice"));
        const category = getField(row, columnMapping, "category") || "imported";
        const unit = getField(row, columnMapping, "unit") || "ea";
        const description = getField(row, columnMapping, "description");

        if (itemName) {
          const materialType = itemName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
          const key = `${itemName.toLowerCase()}|${materialType}`;

          if (!priceBookCache.has(key)) {
            await prisma.materialCost.create({
              data: {
                contractorId,
                category,
                materialType,
                name: description ? `${itemName} - ${description}` : itemName,
                itemType: "material",
                unit,
                costPerUnit: unitPrice,
                wasteFactor: 0,
              },
            });
            priceBookCache.add(key);
            results.priceBookItems++;
          }
        }
      }

      // Create invoices
      if (options.createInvoices) {
        const itemName = getField(row, columnMapping, "itemName");
        const total = parseNumber(getField(row, columnMapping, "total"));
        const customerName = getField(row, columnMapping, "customerName");
        const dateStr = getField(row, columnMapping, "date");
        const invoiceNum = getField(row, columnMapping, "invoiceNumber");

        if ((itemName || total > 0) && customerName) {
          // Get or create customer
          let customerId = customerCache.get(customerName.toLowerCase());
          if (!customerId) {
            const customer = await prisma.customer.create({
              data: { contractorId, name: customerName },
            });
            customerId = customer.id;
            customerCache.set(customerName.toLowerCase(), customerId);
          }

          // Create a quote for the invoice (invoices require a quote)
          const quoteCount = await prisma.quote.count({ where: { contractorId } });
          const quoteNumber = `IMP-${String(quoteCount + 1).padStart(4, "0")}`;
          const qty = parseNumber(getField(row, columnMapping, "quantity")) || 1;
          const unitPrice = parseNumber(getField(row, columnMapping, "unitPrice"));
          const lineTotal = total || unitPrice * qty;

          const quote = await prisma.quote.create({
            data: {
              contractorId,
              customerId,
              quoteNumber,
              trade: "flooring", // Default, can be updated
              status: "accepted",
              materials: [
                {
                  item: itemName || "Imported Item",
                  qty,
                  unit: "ea",
                  cost: lineTotal,
                },
              ],
              subtotal: lineTotal,
              total: lineTotal,
              projectName: `Import: ${invoiceNum || itemName || "CSV Row " + (i + 1)}`,
              notes: "Imported from CSV",
              acceptedAt: dateStr ? new Date(dateStr) : new Date(),
            },
          });

          invoiceCount++;
          const generatedInvoiceNum = invoiceNum || `INV-${String(invoiceCount).padStart(4, "0")}`;

          // Check uniqueness of invoice number
          const existingInvoice = await prisma.invoice.findUnique({
            where: { invoiceNumber: generatedInvoiceNum },
          });

          if (!existingInvoice) {
            await prisma.invoice.create({
              data: {
                contractorId,
                quoteId: quote.id,
                customerId,
                invoiceNumber: generatedInvoiceNum,
                amount: lineTotal,
                paidAmount: lineTotal, // Assume past invoices are paid
                status: "paid",
                dueDate: dateStr ? new Date(dateStr) : new Date(),
                paidAt: dateStr ? new Date(dateStr) : new Date(),
              },
            });
            results.invoices++;
          } else {
            results.errors.push(`Row ${i + 1}: Invoice ${generatedInvoiceNum} already exists, skipped`);
          }
        }
      }
    } catch (err) {
      results.errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    imported: {
      priceBookItems: results.priceBookItems,
      customers: results.customers,
      invoices: results.invoices,
    },
    errors: results.errors.length > 0 ? results.errors : undefined,
  });
}
