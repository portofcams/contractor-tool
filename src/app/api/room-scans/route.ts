/**
 * POST /api/room-scans — Save a LiDAR scan result
 * GET  /api/room-scans — List scans (optionally filtered by customerId/quoteId)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { customerId, quoteId, roomsData, surfaceCount, notes } = body;

  if (!roomsData || !Array.isArray(roomsData) || roomsData.length === 0) {
    return NextResponse.json({ error: "roomsData is required" }, { status: 400 });
  }

  const scan = await prisma.roomScan.create({
    data: {
      contractorId: session.user.id,
      customerId: customerId || null,
      quoteId: quoteId || null,
      roomsData,
      surfaceCount: surfaceCount || 0,
      notes: notes || null,
    },
  });

  return NextResponse.json(scan, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  const quoteId = searchParams.get("quoteId");

  const where: Record<string, unknown> = { contractorId: session.user.id };
  if (customerId) where.customerId = customerId;
  if (quoteId) where.quoteId = quoteId;

  const scans = await prisma.roomScan.findMany({
    where,
    orderBy: { scanDate: "desc" },
    take: 50,
  });

  return NextResponse.json(scans);
}
