import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, contractorId: contractor.id },
    include: {
      tasks: { select: { status: true, estimatedCost: true, actualCost: true } },
      phases: { select: { status: true } },
      changeOrders: { where: { status: "approved" }, select: { costImpact: true, daysImpact: true } },
      dailyLogs: { select: { delayHours: true }, where: { delayHours: { gt: 0 } } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === "done").length;
  const blockedTasks = project.tasks.filter((t) => t.status === "blocked").length;
  const completion = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const totalPhases = project.phases.length;
  const donePhases = project.phases.filter((p) => p.status === "completed").length;

  const now = new Date();
  const endDate = project.estimatedEnd;
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const startDate = project.startDate;
  const totalDays = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const elapsedDays = startDate ? Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const timeProgress = totalDays && totalDays > 0 ? Math.min(100, Math.round((elapsedDays! / totalDays) * 100)) : null;

  const coTotalCost = project.changeOrders.reduce((s, co) => s + co.costImpact, 0);
  const coTotalDays = project.changeOrders.reduce((s, co) => s + co.daysImpact, 0);
  const totalDelayHours = project.dailyLogs.reduce((s, l) => s + (l.delayHours || 0), 0);

  const budget = project.budgetEstimated || 0;
  const adjustedBudget = budget + coTotalCost;
  const spent = project.budgetActual;
  const budgetHealth = adjustedBudget <= 0 ? "no_budget" : spent > adjustedBudget ? "over" : spent > adjustedBudget * 0.85 ? "warning" : "on_track";

  // Schedule health
  const scheduleHealth = daysRemaining === null ? "no_dates"
    : daysRemaining < 0 ? "overdue"
    : timeProgress !== null && completion < timeProgress - 15 ? "behind"
    : "on_track";

  return NextResponse.json({
    completion,
    totalTasks,
    doneTasks,
    blockedTasks,
    totalPhases,
    donePhases,
    daysRemaining,
    totalDays,
    elapsedDays,
    timeProgress,
    budgetEstimated: budget,
    budgetAdjusted: adjustedBudget,
    budgetSpent: spent,
    budgetHealth,
    scheduleHealth,
    changeOrderCount: project.changeOrders.length,
    changeOrderCost: coTotalCost,
    changeOrderDays: coTotalDays,
    totalDelayHours,
    status: project.status,
  });
}
