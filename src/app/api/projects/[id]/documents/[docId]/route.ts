import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; docId: string }> }) {
  const contractor = await getContractor();
  const { id, docId } = await params;

  const project = await prisma.project.findFirst({ where: { id, contractorId: contractor.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.projectDocument.delete({ where: { id: docId } });
  return NextResponse.json({ success: true });
}
