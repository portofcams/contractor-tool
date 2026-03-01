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

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Valid name is required (max 200 chars)" }, { status: 400 });
    }

    if (!trade || !["flooring", "painting", "drywall"].includes(trade)) {
      return NextResponse.json({ error: "Valid trade is required" }, { status: 400 });
    }

    if (!Array.isArray(materials) || materials.length === 0 || materials.length > 100) {
      return NextResponse.json({ error: "Materials array is required (max 100 items)" }, { status: 400 });
    }

    const safeMarkup = typeof markupPercent === "number" ? Math.max(0, Math.min(500, markupPercent)) : 50;
    const safeLabor = typeof laborCost === "number" ? Math.max(0, laborCost) : null;
    const safeTax = typeof taxRate === "number" ? Math.max(0, Math.min(100, taxRate)) : 0;

    const template = await prisma.quoteTemplate.create({
      data: {
        contractorId: contractor.id,
        name: name.slice(0, 200),
        trade,
        materials,
        markupPercent: safeMarkup,
        laborCost: safeLabor,
        taxRate: safeTax,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
