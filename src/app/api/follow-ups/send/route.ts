/**
 * POST /api/follow-ups/send
 *
 * Sends email reminders for follow-ups that are due today or overdue.
 * Designed to be called by a daily cron job (e.g., via Vercel cron or external service).
 * Protected by a secret token to prevent unauthorized access.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendFollowUpReminder } from "@/lib/email";

export async function POST(req: Request) {
  // Verify cron secret (optional — skip in dev)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Find all pending follow-ups where reminderDate is today or in the past
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const dueFollowUps = await prisma.followUp.findMany({
    where: {
      status: "pending",
      reminderDate: { lte: endOfToday },
    },
    include: {
      quote: {
        include: {
          customer: { select: { name: true } },
          contractor: { select: { email: true, companyName: true } },
        },
      },
    },
    take: 50, // Process in batches
  });

  let sent = 0;
  for (const followUp of dueFollowUps) {
    // Skip auto follow-ups for quotes that are already accepted/rejected
    if (followUp.quote.status === "accepted" || followUp.quote.status === "rejected") {
      await prisma.followUp.update({
        where: { id: followUp.id },
        data: { status: "dismissed" },
      });
      continue;
    }

    const result = await sendFollowUpReminder({
      to: followUp.quote.contractor.email,
      companyName: followUp.quote.contractor.companyName,
      customerName: followUp.quote.customer.name,
      quoteNumber: followUp.quote.quoteNumber,
      total: followUp.quote.total,
      message: followUp.message,
    });

    if (result.success) {
      await prisma.followUp.update({
        where: { id: followUp.id },
        data: { status: "sent" },
      });
      sent++;
    }
  }

  return NextResponse.json({ sent, total: dueFollowUps.length });
}
