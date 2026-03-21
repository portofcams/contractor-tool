import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; phaseId: string }> }) {
  const contractor = await getContractor();
  const { id, phaseId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const phase = await prisma.projectPhase.update({
    where: { id: phaseId },
    data: {
      name: body.name,
      description: body.description,
      order: body.order,
      status: body.status,
      startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : undefined,
      endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
      actualStart: body.actualStart !== undefined ? (body.actualStart ? new Date(body.actualStart) : null) : undefined,
      actualEnd: body.actualEnd !== undefined ? (body.actualEnd ? new Date(body.actualEnd) : null) : undefined,
      dependsOnId: body.dependsOnId !== undefined ? body.dependsOnId : undefined,
      budgetEstimated: body.budgetEstimated !== undefined ? parseFloat(body.budgetEstimated) : undefined,
      budgetActual: body.budgetActual !== undefined ? parseFloat(body.budgetActual) : undefined,
      color: body.color !== undefined ? body.color : undefined,
    },
  });

  return NextResponse.json(phase);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; phaseId: string }> }) {
  const contractor = await getContractor();
  const { id, phaseId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.projectPhase.delete({ where: { id: phaseId } });
  return NextResponse.json({ success: true });
}
