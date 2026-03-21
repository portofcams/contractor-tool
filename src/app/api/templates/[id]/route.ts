import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";

// PATCH — update template
export async function PATCH(
  req: Request,
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

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (["flooring", "painting", "drywall"].includes(body.trade)) data.trade = body.trade;
    if (Array.isArray(body.materials)) data.materials = body.materials;
    if (typeof body.markupPercent === "number") data.markupPercent = Math.max(0, Math.min(500, body.markupPercent));
    if (typeof body.laborCost === "number") data.laborCost = Math.max(0, body.laborCost);
    if (typeof body.taxRate === "number") data.taxRate = Math.max(0, Math.min(100, body.taxRate));

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.quoteTemplate.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

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
