import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; bidId: string }> }) {
  const contractor = await getContractor();
  const { id, bidId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const bid = await prisma.subcontractorBid.update({
    where: { id: bidId },
    data: {
      status: body.status,
      amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
      description: body.description,
      estimatedDays: body.estimatedDays !== undefined ? parseInt(body.estimatedDays) : undefined,
      notes: body.notes,
    },
  });

  return NextResponse.json(bid);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; bidId: string }> }) {
  const contractor = await getContractor();
  const { id, bidId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subcontractorBid.delete({ where: { id: bidId } });
  return NextResponse.json({ success: true });
}
