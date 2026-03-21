import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const contractor = await getContractor();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "createdAt";

  const where: Record<string, unknown> = { contractorId: contractor.id };
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const orderBy: Record<string, string> =
    sort === "name" ? { name: "asc" } : sort === "status" ? { status: "asc" } : { createdAt: "desc" };

  const projects = await prisma.project.findMany({
    where,
    orderBy,
    include: {
      customer: { select: { id: true, name: true } },
      phases: { select: { id: true, status: true } },
      tasks: { select: { id: true, status: true } },
      changeOrders: { where: { status: "approved" }, select: { costImpact: true } },
    },
  });

  const result = projects.map((p) => ({
    ...p,
    _counts: {
      phases: p.phases.length,
      tasksTotal: p.tasks.length,
      tasksDone: p.tasks.filter((t) => t.status === "done").length,
    },
    _changeOrderTotal: p.changeOrders.reduce((s, co) => s + co.costImpact, 0),
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const contractor = await getContractor();
  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      contractorId: contractor.id,
      customerId: body.customerId || null,
      name: body.name,
      description: body.description || null,
      address: body.address || null,
      status: body.status || "planning",
      priority: body.priority || "medium",
      startDate: body.startDate ? new Date(body.startDate) : null,
      estimatedEnd: body.estimatedEnd ? new Date(body.estimatedEnd) : null,
      budgetEstimated: body.budgetEstimated ? parseFloat(body.budgetEstimated) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
