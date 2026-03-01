import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { quoteId, scheduledDate, scheduledEnd, notes } = body as {
    quoteId?: string; scheduledDate?: string; scheduledEnd?: string; notes?: string;
  };

  if (!quoteId || !scheduledDate) {
    return NextResponse.json({ error: "quoteId and scheduledDate required" }, { status: 400 });
  }

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, contractorId: session.user.id },
    include: { customer: true },
  });
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  // Check if job already exists for this quote
  const existing = await prisma.job.findUnique({ where: { quoteId } });
  if (existing) return NextResponse.json({ error: "Job already scheduled for this quote" }, { status: 409 });

  try {
    const job = await prisma.job.create({
      data: {
        contractorId: session.user.id,
        quoteId,
        customerId: quote.customerId,
        scheduledDate: new Date(scheduledDate),
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
        notes: notes || null,
      },
      include: { customer: true, quote: true },
    });
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const month = searchParams.get("month"); // YYYY-MM format

  const where: Record<string, unknown> = { contractorId: session.user.id };
  if (status) where.status = status;
  if (month) {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    where.scheduledDate = { gte: start, lt: end };
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { customer: true, quote: true, assignments: { include: { crewMember: true } } },
    orderBy: { scheduledDate: "asc" },
  });
  return NextResponse.json(jobs);
}
