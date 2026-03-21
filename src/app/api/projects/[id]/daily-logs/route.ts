import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const where: Record<string, unknown> = { projectId: id };
  if (from || to) {
    where.date = {};
    if (from) (where.date as Record<string, Date>).gte = new Date(from);
    if (to) (where.date as Record<string, Date>).lte = new Date(to);
  }

  const logs = await prisma.dailyLog.findMany({ where, orderBy: { date: "desc" } });
  return NextResponse.json(logs);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const log = await prisma.dailyLog.create({
    data: {
      projectId: id,
      date: body.date ? new Date(body.date) : new Date(),
      weather: body.weather || null,
      temperature: body.temperature ? parseFloat(body.temperature) : null,
      crewOnSite: body.crewOnSite || null,
      workCompleted: body.workCompleted || null,
      issues: body.issues || null,
      materialsUsed: body.materialsUsed || null,
      safetyNotes: body.safetyNotes || null,
      photos: body.photos || null,
      delayReason: body.delayReason || null,
      delayHours: body.delayHours ? parseFloat(body.delayHours) : null,
    },
  });

  return NextResponse.json(log, { status: 201 });
}
