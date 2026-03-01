import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const job = await prisma.job.findFirst({ where: { id, contractorId: session.user.id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { status, scheduledDate, scheduledEnd, notes } = body as {
    status?: string; scheduledDate?: string; scheduledEnd?: string; notes?: string;
  };

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (scheduledDate) data.scheduledDate = new Date(scheduledDate);
  if (scheduledEnd !== undefined) data.scheduledEnd = scheduledEnd ? new Date(scheduledEnd) : null;
  if (notes !== undefined) data.notes = notes;

  const updated = await prisma.job.update({
    where: { id },
    data,
    include: { customer: true, quote: true, assignments: { include: { crewMember: true } }, actualCosts: true },
  });
  return NextResponse.json(updated);
}

// POST /api/jobs/[id] — Add actual cost or crew assignment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const job = await prisma.job.findFirst({ where: { id, contractorId: session.user.id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { type } = body as { type?: string };

  if (type === "cost") {
    const { description, amount, category, receiptUrl } = body as {
      description?: string; amount?: number; category?: string; receiptUrl?: string;
    };
    if (!description || typeof amount !== "number" || !category) {
      return NextResponse.json({ error: "description, amount, category required" }, { status: 400 });
    }
    const cost = await prisma.actualCost.create({
      data: { contractorId: session.user.id, jobId: id, description, amount, category, receiptUrl: receiptUrl || null },
    });
    return NextResponse.json(cost, { status: 201 });
  }

  if (type === "assignment") {
    const { crewMemberId, hoursWorked, notes } = body as {
      crewMemberId?: string; hoursWorked?: number; notes?: string;
    };
    if (!crewMemberId) return NextResponse.json({ error: "crewMemberId required" }, { status: 400 });

    const crew = await prisma.crewMember.findFirst({ where: { id: crewMemberId, contractorId: session.user.id } });
    if (!crew) return NextResponse.json({ error: "Crew member not found" }, { status: 404 });

    const assignment = await prisma.jobAssignment.create({
      data: { jobId: id, crewMemberId, hoursWorked: hoursWorked || null, notes: notes || null },
      include: { crewMember: true },
    });
    return NextResponse.json(assignment, { status: 201 });
  }

  return NextResponse.json({ error: "type must be 'cost' or 'assignment'" }, { status: 400 });
}
