import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const phases = await prisma.projectPhase.findMany({
    where: { projectId: id },
    orderBy: { order: "asc" },
    include: {
      tasks: {
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, status: true, dueDate: true, completedAt: true,
          estimatedHours: true, actualHours: true,
          crewMember: { select: { name: true } },
          subcontractor: { select: { companyName: true } },
        },
      },
      dependsOn: { select: { id: true, name: true } },
    },
  });

  // Build dependency graph for critical path
  const phaseMap = new Map(phases.map((p) => [p.id, p]));
  const criticalPath: string[] = [];

  // Find longest path through dependencies
  function getPathLength(phaseId: string, visited: Set<string> = new Set()): number {
    if (visited.has(phaseId)) return 0;
    visited.add(phaseId);
    const phase = phaseMap.get(phaseId);
    if (!phase) return 0;

    const start = phase.startDate?.getTime() || 0;
    const end = phase.endDate?.getTime() || start;
    const duration = end - start;

    // Find dependents
    const dependents = phases.filter((p) => p.dependsOnId === phaseId);
    if (dependents.length === 0) return duration;

    let maxChildPath = 0;
    for (const dep of dependents) {
      const childPath = getPathLength(dep.id, new Set(visited));
      maxChildPath = Math.max(maxChildPath, childPath);
    }

    return duration + maxChildPath;
  }

  // Find roots (phases with no dependencies)
  const roots = phases.filter((p) => !p.dependsOnId);
  let maxPath = 0;
  let criticalRoot = "";

  for (const root of roots) {
    const pathLen = getPathLength(root.id);
    if (pathLen > maxPath) {
      maxPath = pathLen;
      criticalRoot = root.id;
    }
  }

  // Trace critical path
  if (criticalRoot) {
    let current: string | null = criticalRoot;
    while (current) {
      criticalPath.push(current);
      const dependents = phases.filter((p) => p.dependsOnId === current);
      if (dependents.length === 0) break;
      // Pick the dependent with the longest remaining path
      let best: string | null = null;
      let bestLen = 0;
      for (const dep of dependents) {
        const len = getPathLength(dep.id);
        if (len > bestLen) {
          bestLen = len;
          best = dep.id;
        }
      }
      current = best;
    }
  }

  return NextResponse.json({
    phases: phases.map((p) => ({
      ...p,
      _tasksDone: p.tasks.filter((t) => t.status === "done").length,
      _tasksTotal: p.tasks.length,
      _isCritical: criticalPath.includes(p.id),
    })),
    criticalPath,
    projectStart: project.startDate,
    projectEnd: project.estimatedEnd,
  });
}
