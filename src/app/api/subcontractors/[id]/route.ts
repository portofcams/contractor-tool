import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const sub = await prisma.subcontractor.findFirst({
    where: { id, contractorId: contractor.id },
    include: {
      bids: {
        include: { phase: { select: { name: true, project: { select: { name: true } } } } },
        orderBy: { submittedAt: "desc" },
      },
      tasks: {
        include: { project: { select: { name: true } }, phase: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sub);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const existing = await prisma.subcontractor.findFirst({ where: { id, contractorId: contractor.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const sub = await prisma.subcontractor.update({
    where: { id },
    data: {
      companyName: body.companyName ?? existing.companyName,
      contactName: body.contactName !== undefined ? body.contactName : existing.contactName,
      email: body.email !== undefined ? body.email : existing.email,
      phone: body.phone !== undefined ? body.phone : existing.phone,
      trade: body.trade ?? existing.trade,
      licenseNumber: body.licenseNumber !== undefined ? body.licenseNumber : existing.licenseNumber,
      insuranceExpiry: body.insuranceExpiry !== undefined ? (body.insuranceExpiry ? new Date(body.insuranceExpiry) : null) : existing.insuranceExpiry,
      hourlyRate: body.hourlyRate !== undefined ? parseFloat(body.hourlyRate) : existing.hourlyRate,
      rating: body.rating !== undefined ? parseInt(body.rating) : existing.rating,
      notes: body.notes !== undefined ? body.notes : existing.notes,
      active: body.active !== undefined ? body.active : existing.active,
    },
  });

  return NextResponse.json(sub);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const existing = await prisma.subcontractor.findFirst({ where: { id, contractorId: contractor.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subcontractor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
