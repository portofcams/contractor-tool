import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const phaseId = searchParams.get("phaseId");
  const status = searchParams.get("status");

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const where: Record<string, unknown> = { projectId: id };
  if (phaseId) where.phaseId = phaseId;
  if (status) where.status = status;

  const tasks = await prisma.projectTask.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      phase: { select: { id: true, name: true, color: true } },
      crewMember: { select: { id: true, name: true } },
      subcontractor: { select: { id: true, companyName: true } },
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const maxOrder = await prisma.projectTask.aggregate({ where: { projectId: id }, _max: { order: true } });

  const task = await prisma.projectTask.create({
    data: {
      projectId: id,
      phaseId: body.phaseId || null,
      title: body.title,
      description: body.description || null,
      status: body.status || "todo",
      priority: body.priority || "medium",
      assigneeType: body.assigneeType || null,
      crewMemberId: body.crewMemberId || null,
      subcontractorId: body.subcontractorId || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      estimatedHours: body.estimatedHours ? parseFloat(body.estimatedHours) : null,
      estimatedCost: body.estimatedCost ? parseFloat(body.estimatedCost) : null,
      order: body.order ?? (maxOrder._max.order ?? -1) + 1,
    },
    include: {
      phase: { select: { id: true, name: true, color: true } },
      crewMember: { select: { id: true, name: true } },
      subcontractor: { select: { id: true, companyName: true } },
    },
  });

  return NextResponse.json(task, { status: 201 });
}
