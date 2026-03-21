/**
 * GET /api/materials/prices — Get current prices + trend data
 * POST /api/materials/prices — Record a price update (manual)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  // Get contractor's custom + default materials
  const materials = await prisma.materialCost.findMany({
    where: {
      OR: [{ contractorId: session.user.id }, { contractorId: null }],
      ...(category ? { category } : {}),
    },
    orderBy: { category: "asc" },
  });

  // Get price history for trends (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const priceHistory = await prisma.priceHistory.findMany({
    where: { recordedAt: { gte: ninetyDaysAgo } },
    orderBy: { recordedAt: "asc" },
  });

  // Group history by material type
  const trends: Record<string, { date: string; price: number }[]> = {};
  for (const ph of priceHistory) {
    if (!trends[ph.materialType]) trends[ph.materialType] = [];
    trends[ph.materialType].push({
      date: ph.recordedAt.toISOString().slice(0, 10),
      price: ph.price,
    });
  }

  return NextResponse.json({ materials, trends });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { materialType, price, source } = body;

  if (!materialType || price == null) {
    return NextResponse.json(
      { error: "materialType and price required" },
      { status: 400 }
    );
  }

  const record = await prisma.priceHistory.create({
    data: {
      materialType,
      price,
      source: source || "manual",
    },
  });

  // Update the contractor's material cost
  const existing = await prisma.materialCost.findFirst({
    where: { contractorId: session.user.id, materialType },
  });

  if (existing) {
    await prisma.materialCost.update({
      where: { id: existing.id },
      data: { costPerUnit: price },
    });
  }

  return NextResponse.json(record, { status: 201 });
}
