/**
 * POST /api/templates/defaults
 *
 * Seeds default quote templates for the contractor's trade.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const defaultTemplates: Record<string, { name: string; materials: Record<string, unknown>[] }[]> = {
  flooring: [
    {
      name: "Standard Hardwood Install",
      materials: [
        { item: "Hardwood Flooring", qty: 0, unit: "sqft", unitCost: 5.50, cost: 0 },
        { item: "Underlayment", qty: 0, unit: "sqft", unitCost: 0.75, cost: 0 },
        { item: "Transition Strips", qty: 3, unit: "pcs", unitCost: 12.00, cost: 36.00 },
        { item: "Nails/Adhesive", qty: 1, unit: "kit", unitCost: 45.00, cost: 45.00 },
      ],
    },
    {
      name: "LVP/Laminate Install",
      materials: [
        { item: "LVP/Laminate Flooring", qty: 0, unit: "sqft", unitCost: 3.25, cost: 0 },
        { item: "Underlayment", qty: 0, unit: "sqft", unitCost: 0.50, cost: 0 },
        { item: "Transition Strips", qty: 3, unit: "pcs", unitCost: 8.00, cost: 24.00 },
        { item: "Quarter Round Trim", qty: 0, unit: "lft", unitCost: 1.50, cost: 0 },
      ],
    },
    {
      name: "Tile Install",
      materials: [
        { item: "Ceramic/Porcelain Tile", qty: 0, unit: "sqft", unitCost: 4.00, cost: 0 },
        { item: "Thinset Mortar", qty: 2, unit: "bags", unitCost: 18.00, cost: 36.00 },
        { item: "Grout", qty: 1, unit: "bags", unitCost: 15.00, cost: 15.00 },
        { item: "Tile Spacers", qty: 2, unit: "packs", unitCost: 5.00, cost: 10.00 },
      ],
    },
  ],
  painting: [
    {
      name: "Interior Room Repaint",
      materials: [
        { item: "Interior Paint", qty: 2, unit: "gal", unitCost: 35.00, cost: 70.00 },
        { item: "Primer", qty: 1, unit: "gal", unitCost: 25.00, cost: 25.00 },
        { item: "Painter's Tape", qty: 3, unit: "rolls", unitCost: 6.00, cost: 18.00 },
        { item: "Drop Cloths", qty: 2, unit: "pcs", unitCost: 8.00, cost: 16.00 },
        { item: "Rollers & Brushes", qty: 1, unit: "kit", unitCost: 25.00, cost: 25.00 },
      ],
    },
    {
      name: "Exterior House Paint",
      materials: [
        { item: "Exterior Paint", qty: 8, unit: "gal", unitCost: 45.00, cost: 360.00 },
        { item: "Exterior Primer", qty: 3, unit: "gal", unitCost: 30.00, cost: 90.00 },
        { item: "Caulk", qty: 6, unit: "tubes", unitCost: 5.00, cost: 30.00 },
        { item: "Painter's Tape", qty: 5, unit: "rolls", unitCost: 6.00, cost: 30.00 },
      ],
    },
    {
      name: "Cabinet Refinishing",
      materials: [
        { item: "Cabinet Paint/Stain", qty: 2, unit: "gal", unitCost: 50.00, cost: 100.00 },
        { item: "Primer/Deglosser", qty: 1, unit: "gal", unitCost: 28.00, cost: 28.00 },
        { item: "Sandpaper (assorted)", qty: 1, unit: "pack", unitCost: 15.00, cost: 15.00 },
        { item: "Hardware", qty: 20, unit: "pcs", unitCost: 4.00, cost: 80.00 },
      ],
    },
  ],
  drywall: [
    {
      name: "New Drywall Install",
      materials: [
        { item: "Drywall Sheets (4x8)", qty: 0, unit: "sheets", unitCost: 14.00, cost: 0 },
        { item: "Drywall Screws", qty: 2, unit: "boxes", unitCost: 8.00, cost: 16.00 },
        { item: "Joint Tape", qty: 2, unit: "rolls", unitCost: 5.00, cost: 10.00 },
        { item: "Joint Compound", qty: 2, unit: "buckets", unitCost: 15.00, cost: 30.00 },
      ],
    },
    {
      name: "Drywall Repair/Patch",
      materials: [
        { item: "Drywall Patch Kit", qty: 1, unit: "kit", unitCost: 12.00, cost: 12.00 },
        { item: "Joint Compound", qty: 1, unit: "bucket", unitCost: 15.00, cost: 15.00 },
        { item: "Sandpaper", qty: 1, unit: "pack", unitCost: 8.00, cost: 8.00 },
        { item: "Primer", qty: 1, unit: "qt", unitCost: 12.00, cost: 12.00 },
      ],
    },
    {
      name: "Ceiling Texture/Popcorn",
      materials: [
        { item: "Ceiling Texture Spray", qty: 4, unit: "cans", unitCost: 12.00, cost: 48.00 },
        { item: "Plastic Sheeting", qty: 2, unit: "rolls", unitCost: 10.00, cost: 20.00 },
        { item: "Joint Compound", qty: 1, unit: "bucket", unitCost: 15.00, cost: 15.00 },
        { item: "Painter's Tape", qty: 3, unit: "rolls", unitCost: 6.00, cost: 18.00 },
      ],
    },
  ],
};

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
    select: { trade: true },
  });

  if (!contractor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const templates = defaultTemplates[contractor.trade] || defaultTemplates.flooring;

  const created = await prisma.$transaction(
    templates.map((t) =>
      prisma.quoteTemplate.create({
        data: {
          contractorId: session.user.id,
          name: t.name,
          trade: contractor.trade,
          materials: t.materials as unknown as Prisma.InputJsonValue,
          markupPercent: 50,
          taxRate: 0,
        },
      })
    )
  );

  return NextResponse.json({ count: created.length }, { status: 201 });
}
