import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const contractor = await getContractor();
  const { id, taskId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const task = await prisma.projectTask.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description,
      phaseId: body.phaseId !== undefined ? body.phaseId : undefined,
      status: body.status,
      priority: body.priority,
      assigneeType: body.assigneeType,
      crewMemberId: body.crewMemberId !== undefined ? body.crewMemberId : undefined,
      subcontractorId: body.subcontractorId !== undefined ? body.subcontractorId : undefined,
      dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : undefined,
      completedAt: body.status === "done" ? new Date() : body.status !== "done" ? null : undefined,
      estimatedHours: body.estimatedHours !== undefined ? parseFloat(body.estimatedHours) : undefined,
      actualHours: body.actualHours !== undefined ? parseFloat(body.actualHours) : undefined,
      estimatedCost: body.estimatedCost !== undefined ? parseFloat(body.estimatedCost) : undefined,
      actualCost: body.actualCost !== undefined ? parseFloat(body.actualCost) : undefined,
      order: body.order,
    },
    include: {
      phase: { select: { id: true, name: true, color: true } },
      crewMember: { select: { id: true, name: true } },
      subcontractor: { select: { id: true, companyName: true } },
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const contractor = await getContractor();
  const { id, taskId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.projectTask.delete({ where: { id: taskId } });
  return NextResponse.json({ success: true });
}
