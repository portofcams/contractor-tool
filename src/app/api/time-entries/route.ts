import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const timeEntrySchema = z.object({
  jobId: z.string().uuid().optional(),
  crewMemberId: z.string().uuid().optional(),
  date: z.string().optional(), // ISO date
  clockIn: z.string(), // ISO datetime
  clockOut: z.string().optional(), // ISO datetime
  hours: z.number().optional(),
  hourlyRate: z.number().optional(),
  description: z.string().max(500).optional(),
  billable: z.boolean().default(true),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  const crewMemberId = url.searchParams.get("crewMemberId");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = { contractorId: session.user.id };
  if (jobId) where.jobId = jobId;
  if (crewMemberId) where.crewMemberId = crewMemberId;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const entries = await prisma.timeEntry.findMany({
    where,
    include: {
      job: { select: { id: true, quote: { select: { projectName: true } } } },
      crewMember: { select: { id: true, name: true } },
    },
    orderBy: { clockIn: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = timeEntrySchema.parse(body);

    // Calculate hours if clockOut provided
    let hours = data.hours;
    if (data.clockOut && !hours) {
      const diff = new Date(data.clockOut).getTime() - new Date(data.clockIn).getTime();
      hours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    }

    // Get hourly rate from crew member if not provided
    let hourlyRate = data.hourlyRate;
    if (!hourlyRate && data.crewMemberId) {
      const crew = await prisma.crewMember.findUnique({
        where: { id: data.crewMemberId },
        select: { hourlyRate: true },
      });
      hourlyRate = crew?.hourlyRate ?? undefined;
    }

    const entry = await prisma.timeEntry.create({
      data: {
        contractorId: session.user.id,
        jobId: data.jobId || null,
        crewMemberId: data.crewMemberId || null,
        date: data.date ? new Date(data.date) : new Date(),
        clockIn: new Date(data.clockIn),
        clockOut: data.clockOut ? new Date(data.clockOut) : null,
        hours: hours ?? null,
        hourlyRate: hourlyRate ?? null,
        description: data.description || null,
        billable: data.billable,
      },
      include: {
        job: { select: { id: true, quote: { select: { projectName: true } } } },
        crewMember: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Invalid input: ${error.issues[0].message}` },
        { status: 400 }
      );
    }
    console.error("Time entry error:", error);
    return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 });
  }
}

// PATCH — update (clock out, edit hours)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.timeEntry.findFirst({
      where: { id, contractorId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Recalculate hours if clocking out
    const data: any = {};
    if (updates.clockOut) {
      data.clockOut = new Date(updates.clockOut);
      const clockIn = existing.clockIn;
      const diff = data.clockOut.getTime() - clockIn.getTime();
      data.hours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    }
    if (updates.hours !== undefined) data.hours = updates.hours;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.billable !== undefined) data.billable = updates.billable;
    if (updates.jobId !== undefined) data.jobId = updates.jobId || null;

    const entry = await prisma.timeEntry.update({
      where: { id },
      data,
      include: {
        job: { select: { id: true, quote: { select: { projectName: true } } } },
        crewMember: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Time entry update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await prisma.timeEntry.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.timeEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
