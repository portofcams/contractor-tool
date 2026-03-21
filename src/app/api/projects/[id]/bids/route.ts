import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const contractor = await getContractor();
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const phases = await prisma.projectPhase.findMany({
    where: { projectId: id },
    select: { id: true },
  });
  const phaseIds = phases.map((p) => p.id);

  const bids = await prisma.subcontractorBid.findMany({
    where: { phaseId: { in: phaseIds } },
    include: {
      subcontractor: { select: { id: true, companyName: true, trade: true, phone: true, email: true } },
      phase: { select: { id: true, name: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(bids);
}
