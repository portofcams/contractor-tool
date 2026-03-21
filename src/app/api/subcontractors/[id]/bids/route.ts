import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const sub = await prisma.subcontractor.findFirst({ where: { id, contractorId: contractor.id } });
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bids = await prisma.subcontractorBid.findMany({
    where: { subcontractorId: id },
    include: {
      phase: {
        select: { id: true, name: true, project: { select: { id: true, name: true } } },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(bids);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const sub = await prisma.subcontractor.findFirst({ where: { id, contractorId: contractor.id } });
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Verify the phase belongs to a project owned by this contractor
  const phase = await prisma.projectPhase.findFirst({
    where: { id: body.phaseId },
    include: { project: { select: { contractorId: true } } },
  });
  if (!phase || phase.project.contractorId !== contractor.id) {
    return NextResponse.json({ error: "Phase not found" }, { status: 404 });
  }

  const bid = await prisma.subcontractorBid.create({
    data: {
      subcontractorId: id,
      phaseId: body.phaseId,
      amount: parseFloat(body.amount),
      description: body.description || null,
      status: "pending",
      estimatedDays: body.estimatedDays ? parseInt(body.estimatedDays) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(bid, { status: 201 });
}
