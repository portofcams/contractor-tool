import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; orderId: string }> }) {
  const contractor = await getContractor();
  const { id, orderId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const order = await prisma.changeOrder.update({
    where: { id: orderId },
    data: {
      title: body.title,
      description: body.description,
      reason: body.reason,
      status: body.status,
      costImpact: body.costImpact !== undefined ? parseFloat(body.costImpact) : undefined,
      daysImpact: body.daysImpact !== undefined ? parseInt(body.daysImpact) : undefined,
      approvedBy: body.approvedBy,
      approvedAt: body.status === "approved" ? new Date() : undefined,
    },
  });

  // Update project budget if change order approved
  if (body.status === "approved") {
    const allApproved = await prisma.changeOrder.findMany({
      where: { projectId: id, status: "approved" },
    });
    const totalImpact = allApproved.reduce((s, co) => s + co.costImpact, 0);
    await prisma.project.update({
      where: { id },
      data: { budgetActual: (project.budgetEstimated || 0) + totalImpact },
    });
  }

  return NextResponse.json(order);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; orderId: string }> }) {
  const contractor = await getContractor();
  const { id, orderId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.changeOrder.delete({ where: { id: orderId } });
  return NextResponse.json({ success: true });
}
