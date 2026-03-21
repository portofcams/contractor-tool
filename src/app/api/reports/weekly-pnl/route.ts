import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWeeklyPnLEmail } from "@/lib/email";

export async function GET(req: Request) {
  // Optional cron auth
  const apiKey = req.headers.get("x-api-key");
  if (process.env.CRON_SECRET && apiKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const contractors = await prisma.contractor.findMany({
    select: { id: true, email: true, companyName: true },
  });

  let sent = 0;
  let errors = 0;

  for (const contractor of contractors) {
    try {
      const [acceptedQuotes, completedJobs, costs, sentQuotes, viewedQuotes] =
        await Promise.all([
          prisma.quote.findMany({
            where: {
              contractorId: contractor.id,
              acceptedAt: { gte: weekAgo },
              status: "accepted",
            },
            include: { customer: { select: { name: true } } },
            orderBy: { total: "desc" },
            take: 3,
          }),
          prisma.job.count({
            where: {
              contractorId: contractor.id,
              status: "completed",
              createdAt: { gte: weekAgo },
            },
          }),
          prisma.actualCost.aggregate({
            where: {
              contractorId: contractor.id,
              createdAt: { gte: weekAgo },
            },
            _sum: { amount: true },
          }),
          prisma.quote.count({
            where: {
              contractorId: contractor.id,
              sentAt: { gte: weekAgo },
            },
          }),
          prisma.quote.count({
            where: {
              contractorId: contractor.id,
              viewedAt: { gte: weekAgo },
            },
          }),
        ]);

      const revenueWon = acceptedQuotes.reduce((sum, q) => sum + q.total, 0);
      const totalCosts = costs._sum.amount || 0;
      const profit = revenueWon - totalCosts;
      const profitMargin = revenueWon > 0 ? (profit / revenueWon) * 100 : 0;

      const result = await sendWeeklyPnLEmail({
        to: contractor.email,
        companyName: contractor.companyName,
        weekStart: weekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weekEnd: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        revenueWon,
        totalCosts,
        profit,
        profitMargin: Math.round(profitMargin * 10) / 10,
        jobsCompleted: completedJobs,
        quotesSent: sentQuotes,
        quotesViewed: viewedQuotes,
        topDeals: acceptedQuotes.map((q) => ({
          customerName: q.customer.name,
          amount: q.total,
        })),
      });

      if (result.success) sent++;
      else errors++;
    } catch (err) {
      console.error(`Weekly P&L error for ${contractor.email}:`, err);
      errors++;
    }
  }

  return NextResponse.json({ sent, errors });
}
