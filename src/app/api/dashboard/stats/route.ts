import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const contractor = await getContractor();

    // Get quotes from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const quotes = await prisma.quote.findMany({
      where: {
        contractorId: contractor.id,
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
        total: true,
        status: true,
        trade: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Build monthly data
    const monthlyMap = new Map<string, { quotes: number; revenue: number; accepted: number; rejected: number; pending: number }>();

    // Initialize all 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, { quotes: 0, revenue: 0, accepted: 0, rejected: 0, pending: 0 });
    }

    for (const q of quotes) {
      const d = new Date(q.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = monthlyMap.get(key);
      if (!entry) continue;

      entry.quotes++;
      if (q.status === "accepted") {
        entry.revenue += q.total;
        entry.accepted++;
      } else if (q.status === "rejected") {
        entry.rejected++;
      } else {
        entry.pending++;
      }
    }

    const monthly = Array.from(monthlyMap.entries()).map(([key, data]) => {
      const [year, month] = key.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        ...data,
      };
    });

    // Status breakdown for all time
    const statusCounts = await prisma.quote.groupBy({
      by: ["status"],
      where: { contractorId: contractor.id },
      _count: true,
    });

    const statusBreakdown = statusCounts.map((s) => ({
      name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
      value: s._count,
    }));

    // Trade breakdown
    const tradeCounts = await prisma.quote.groupBy({
      by: ["trade"],
      where: { contractorId: contractor.id },
      _count: true,
      _sum: { total: true },
    });

    const tradeBreakdown = tradeCounts.map((t) => ({
      name: t.trade.charAt(0).toUpperCase() + t.trade.slice(1),
      quotes: t._count,
      revenue: t._sum.total ?? 0,
    }));

    return NextResponse.json({ monthly, statusBreakdown, tradeBreakdown });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
