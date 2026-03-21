import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; logId: string }> }) {
  const contractor = await getContractor();
  const { id, logId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const log = await prisma.dailyLog.update({
    where: { id: logId },
    data: {
      date: body.date ? new Date(body.date) : undefined,
      weather: body.weather,
      temperature: body.temperature !== undefined ? parseFloat(body.temperature) : undefined,
      crewOnSite: body.crewOnSite,
      workCompleted: body.workCompleted,
      issues: body.issues,
      materialsUsed: body.materialsUsed,
      safetyNotes: body.safetyNotes,
      photos: body.photos,
      delayReason: body.delayReason,
      delayHours: body.delayHours !== undefined ? parseFloat(body.delayHours) : undefined,
    },
  });

  return NextResponse.json(log);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; logId: string }> }) {
  const contractor = await getContractor();
  const { id, logId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.dailyLog.delete({ where: { id: logId } });
  return NextResponse.json({ success: true });
}
