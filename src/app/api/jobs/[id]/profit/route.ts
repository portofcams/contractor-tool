import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await prisma.job.findFirst({
    where: { id, contractorId: session.user.id },
    include: {
      quote: {
        include: { customer: { select: { name: true } } },
      },
      actualCosts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const materials = job.quote.materials as Array<{ item: string; qty: number; unit: string; cost: number }>;
  const estimatedRevenue = job.quote.total;
  const estimatedMaterials = materials.reduce((sum, m) => sum + (m.cost || 0), 0);
  const estimatedLabor = job.quote.laborCost || 0;

  const actualMaterials = job.actualCosts
    .filter((c) => c.category === "materials")
    .reduce((sum, c) => sum + c.amount, 0);
  const actualLabor = job.actualCosts
    .filter((c) => c.category === "labor")
    .reduce((sum, c) => sum + c.amount, 0);
  const actualOther = job.actualCosts
    .filter((c) => c.category === "other")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalActualCost = actualMaterials + actualLabor + actualOther;
  const grossProfit = estimatedRevenue - totalActualCost;
  const profitMargin = estimatedRevenue > 0 ? (grossProfit / estimatedRevenue) * 100 : 0;

  return NextResponse.json({
    jobNumber: job.id,
    customerName: job.quote.customer.name,
    trade: job.quote.trade,
    estimatedRevenue,
    estimatedMaterials,
    estimatedLabor,
    actualMaterials,
    actualLabor,
    actualOther,
    totalActualCost,
    grossProfit,
    profitMargin: Math.round(profitMargin * 10) / 10,
    costBreakdown: job.actualCosts.map((c) => ({
      description: c.description,
      amount: c.amount,
      category: c.category,
      date: c.createdAt.toISOString().split("T")[0],
    })),
  });
}
