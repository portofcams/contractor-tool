/**
 * POST /api/quotes/recur
 *
 * Processes recurring quotes: duplicates quotes whose nextRecurrenceAt is due.
 * Designed to be called by a daily cron job.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomInt } from "crypto";

function advanceDate(date: Date, recurrence: string): Date {
  const next = new Date(date);
  switch (recurrence) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
  }
  return next;
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const dueQuotes = await prisma.quote.findMany({
    where: {
      recurrence: { not: null },
      nextRecurrenceAt: { lte: now },
    },
    take: 50,
  });

  let created = 0;
  for (const quote of dueQuotes) {
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const quoteNumber = `Q${yy}${mm}-${randomInt(1000, 9999)}`;

    await prisma.quote.create({
      data: {
        contractorId: quote.contractorId,
        customerId: quote.customerId,
        quoteNumber,
        trade: quote.trade,
        materials: quote.materials as object,
        subtotal: quote.subtotal,
        laborCost: quote.laborCost,
        markupPercent: quote.markupPercent,
        taxRate: quote.taxRate,
        total: quote.total,
        status: "draft",
        recurrence: quote.recurrence,
        nextRecurrenceAt: advanceDate(now, quote.recurrence!),
      },
    });

    // Clear recurrence on the old quote so it doesn't trigger again
    await prisma.quote.update({
      where: { id: quote.id },
      data: { recurrence: null, nextRecurrenceAt: null },
    });

    created++;
  }

  return NextResponse.json({ created, total: dueQuotes.length });
}
