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
      tasks: { select: { id: true, status: true } },
      dependsOn: { select: { id: true, name: true } },
      subcontractorBids: { include: { subcontractor: { select: { companyName: true } } } },
    },
  });

  return NextResponse.json(phases);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const maxOrder = await prisma.projectPhase.aggregate({ where: { projectId: id }, _max: { order: true } });

  const phase = await prisma.projectPhase.create({
    data: {
      projectId: id,
      name: body.name,
      description: body.description || null,
      order: body.order ?? (maxOrder._max.order ?? -1) + 1,
      status: body.status || "not_started",
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      dependsOnId: body.dependsOnId || null,
      budgetEstimated: body.budgetEstimated ? parseFloat(body.budgetEstimated) : null,
      color: body.color || null,
    },
  });

  return NextResponse.json(phase, { status: 201 });
}
