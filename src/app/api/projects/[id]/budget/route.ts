import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, contractorId: contractor.id },
    include: {
      phases: {
        orderBy: { order: "asc" },
        select: { id: true, name: true, budgetEstimated: true, budgetActual: true, status: true },
      },
      changeOrders: true,
      tasks: { select: { estimatedCost: true, actualCost: true } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const approvedCOs = project.changeOrders.filter((co) => co.status === "approved");
  const pendingCOs = project.changeOrders.filter((co) => co.status === "proposed");
  const coApprovedTotal = approvedCOs.reduce((s, co) => s + co.costImpact, 0);
  const coPendingTotal = pendingCOs.reduce((s, co) => s + co.costImpact, 0);

  const phaseEstimated = project.phases.reduce((s, p) => s + (p.budgetEstimated || 0), 0);
  const phaseActual = project.phases.reduce((s, p) => s + p.budgetActual, 0);

  const taskEstimated = project.tasks.reduce((s, t) => s + (t.estimatedCost || 0), 0);
  const taskActual = project.tasks.reduce((s, t) => s + (t.actualCost || 0), 0);

  const originalBudget = project.budgetEstimated || 0;
  const adjustedBudget = originalBudget + coApprovedTotal;
  const totalSpent = Math.max(phaseActual, taskActual, project.budgetActual);
  const remaining = adjustedBudget - totalSpent;
  const percentUsed = adjustedBudget > 0 ? (totalSpent / adjustedBudget) * 100 : 0;

  return NextResponse.json({
    originalBudget,
    changeOrdersApproved: coApprovedTotal,
    changeOrdersPending: coPendingTotal,
    adjustedBudget,
    totalSpent,
    remaining,
    percentUsed: Math.round(percentUsed),
    health: percentUsed > 100 ? "over" : percentUsed > 85 ? "warning" : "on_track",
    phases: project.phases.map((p) => ({
      id: p.id,
      name: p.name,
      estimated: p.budgetEstimated || 0,
      actual: p.budgetActual,
      variance: (p.budgetEstimated || 0) - p.budgetActual,
      status: p.status,
    })),
    changeOrders: project.changeOrders.map((co) => ({
      id: co.id,
      orderNumber: co.orderNumber,
      title: co.title,
      costImpact: co.costImpact,
      daysImpact: co.daysImpact,
      status: co.status,
    })),
  });
}
