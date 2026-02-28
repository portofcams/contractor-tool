import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";

// DELETE — remove template
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractor = await getContractor();

    const template = await prisma.quoteTemplate.findFirst({
      where: { id, contractorId: contractor.id },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await prisma.quoteTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
