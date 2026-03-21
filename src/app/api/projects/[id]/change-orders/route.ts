import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const orders = await prisma.changeOrder.findMany({
    where: { projectId: id },
    orderBy: { orderNumber: "asc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const maxNum = await prisma.changeOrder.aggregate({ where: { projectId: id }, _max: { orderNumber: true } });

  const order = await prisma.changeOrder.create({
    data: {
      projectId: id,
      orderNumber: (maxNum._max.orderNumber ?? 0) + 1,
      title: body.title,
      description: body.description,
      reason: body.reason || null,
      status: body.status || "proposed",
      costImpact: body.costImpact ? parseFloat(body.costImpact) : 0,
      daysImpact: body.daysImpact ? parseInt(body.daysImpact) : 0,
    },
  });

  return NextResponse.json(order, { status: 201 });
}
