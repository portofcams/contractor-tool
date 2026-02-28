/**
 * PUT /api/settings/materials
 *
 * Saves custom material pricing for the contractor.
 * Deletes existing custom prices and replaces with the new set.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { materials } = body;

  if (!Array.isArray(materials)) {
    return NextResponse.json({ error: "Invalid materials" }, { status: 400 });
  }

  // Delete existing custom materials for this contractor
  await prisma.materialCost.deleteMany({
    where: { contractorId: session.user.id },
  });

  // Create new custom materials
  if (materials.length > 0) {
    await prisma.materialCost.createMany({
      data: materials.map(
        (m: { category: string; materialType: string; unit: string; costPerUnit: number }) => ({
          id: `custom-${session.user.id}-${m.category}-${m.materialType}`,
          contractorId: session.user.id,
          category: m.category,
          materialType: m.materialType,
          unit: m.unit,
          costPerUnit: m.costPerUnit,
        })
      ),
    });
  }

  return NextResponse.json({ success: true, count: materials.length });
}
