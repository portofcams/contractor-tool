import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const contractor = await getContractor();
  const { searchParams } = new URL(req.url);
  const trade = searchParams.get("trade");

  const where: Record<string, unknown> = { contractorId: contractor.id };
  if (trade) where.trade = trade;

  const subs = await prisma.subcontractor.findMany({
    where,
    orderBy: { companyName: "asc" },
    include: {
      bids: { select: { id: true, status: true, amount: true } },
      _count: { select: { tasks: true } },
    },
  });

  return NextResponse.json(subs);
}

export async function POST(req: Request) {
  const contractor = await getContractor();
  const body = await req.json();

  const sub = await prisma.subcontractor.create({
    data: {
      contractorId: contractor.id,
      companyName: body.companyName,
      contactName: body.contactName || null,
      email: body.email || null,
      phone: body.phone || null,
      trade: body.trade,
      licenseNumber: body.licenseNumber || null,
      insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
      hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
      rating: body.rating ? parseInt(body.rating) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(sub, { status: 201 });
}
