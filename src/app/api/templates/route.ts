import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";

// GET — list templates
export async function GET() {
  try {
    const contractor = await getContractor();

    const templates = await prisma.quoteTemplate.findMany({
      where: { contractorId: contractor.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST — create template
export async function POST(req: Request) {
  try {
    const contractor = await getContractor();
    const body = await req.json();

    const { name, trade, materials, markupPercent, laborCost, taxRate } = body;

    if (!name || !trade || !materials) {
      return NextResponse.json({ error: "Name, trade, and materials are required" }, { status: 400 });
    }

    const template = await prisma.quoteTemplate.create({
      data: {
        contractorId: contractor.id,
        name,
        trade,
        materials,
        markupPercent: markupPercent ?? 50,
        laborCost: laborCost || null,
        taxRate: taxRate ?? 0,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
