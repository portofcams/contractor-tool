/**
 * GET /api/quotes/export
 *
 * Exports all quotes as a CSV file.
 * Columns: Quote Number, Customer, Trade, Status, Subtotal, Markup%, Labor, Tax%, Total, Created, Sent, Accepted
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quotes = await prisma.quote.findMany({
    where: { contractorId: session.user.id },
    include: { customer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Quote Number",
    "Customer",
    "Customer Email",
    "Trade",
    "Status",
    "Subtotal",
    "Markup %",
    "Labor",
    "Tax %",
    "Total",
    "Created",
    "Sent",
    "Accepted",
  ];

  const rows = quotes.map((q) => [
    escapeCSV(q.quoteNumber),
    escapeCSV(q.customer.name),
    escapeCSV(q.customer.email || ""),
    escapeCSV(q.trade),
    escapeCSV(q.status),
    q.subtotal.toFixed(2),
    q.markupPercent.toString(),
    (q.laborCost ?? 0).toFixed(2),
    q.taxRate.toString(),
    q.total.toFixed(2),
    formatDate(q.createdAt),
    formatDate(q.sentAt),
    formatDate(q.acceptedAt),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="quotes-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
