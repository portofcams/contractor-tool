import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, contractorId: contractor.id },
    include: {
      customer: true,
      phases: {
        orderBy: { order: "asc" },
        include: {
          tasks: { orderBy: { order: "asc" } },
          subcontractorBids: { include: { subcontractor: { select: { companyName: true, trade: true } } } },
          dependsOn: { select: { id: true, name: true } },
        },
      },
      tasks: {
        orderBy: { order: "asc" },
        include: {
          phase: { select: { id: true, name: true, color: true } },
          crewMember: { select: { id: true, name: true } },
          subcontractor: { select: { id: true, companyName: true } },
        },
      },
      dailyLogs: { orderBy: { date: "desc" }, take: 20 },
      changeOrders: { orderBy: { orderNumber: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
      quotes: { include: { customer: { select: { name: true } } } },
      jobs: { include: { quote: { select: { quoteNumber: true, trade: true } } } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      address: body.address !== undefined ? body.address : existing.address,
      customerId: body.customerId !== undefined ? body.customerId : existing.customerId,
      status: body.status ?? existing.status,
      priority: body.priority ?? existing.priority,
      startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : existing.startDate,
      estimatedEnd: body.estimatedEnd !== undefined ? (body.estimatedEnd ? new Date(body.estimatedEnd) : null) : existing.estimatedEnd,
      actualEnd: body.actualEnd !== undefined ? (body.actualEnd ? new Date(body.actualEnd) : null) : existing.actualEnd,
      budgetEstimated: body.budgetEstimated !== undefined ? parseFloat(body.budgetEstimated) : existing.budgetEstimated,
      budgetActual: body.budgetActual !== undefined ? parseFloat(body.budgetActual) : existing.budgetActual,
      notes: body.notes !== undefined ? body.notes : existing.notes,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const existing = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
