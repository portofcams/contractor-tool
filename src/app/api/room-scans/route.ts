/**
 * POST /api/room-scans — Save a LiDAR scan result
 * GET  /api/room-scans — List scans (optionally filtered by customerId/quoteId)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Validate that customerId/quoteId belong to this contractor */
async function verifyOwnership(
  contractorId: string,
  customerId?: string | null,
  quoteId?: string | null
): Promise<string | null> {
  if (customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, contractorId },
    });
    if (!customer) return "Customer not found";
  }
  if (quoteId) {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, contractorId },
    });
    if (!quote) return "Quote not found";
  }
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { customerId, quoteId, roomsData, surfaceCount, notes } = body as {
    customerId?: string;
    quoteId?: string;
    roomsData?: unknown[];
    surfaceCount?: number;
    notes?: string;
  };

  if (!roomsData || !Array.isArray(roomsData) || roomsData.length === 0) {
    return NextResponse.json({ error: "roomsData is required" }, { status: 400 });
  }

  // Cap array size
  if (roomsData.length > 100) {
    return NextResponse.json({ error: "Too many rooms (max 100)" }, { status: 400 });
  }

  // Validate each room object shape
  for (const room of roomsData) {
    if (typeof room !== "object" || room === null) {
      return NextResponse.json({ error: "Invalid room data" }, { status: 400 });
    }
    const r = room as Record<string, unknown>;
    if (typeof r.length !== "number" || typeof r.width !== "number" || typeof r.height !== "number") {
      return NextResponse.json({ error: "Each room must have numeric length, width, height" }, { status: 400 });
    }
  }

  // Validate notes length
  if (notes && (typeof notes !== "string" || notes.length > 5000)) {
    return NextResponse.json({ error: "Notes too long (max 5000 chars)" }, { status: 400 });
  }

  // IDOR: verify ownership of customerId/quoteId
  const ownershipError = await verifyOwnership(session.user.id, customerId, quoteId);
  if (ownershipError) {
    return NextResponse.json({ error: ownershipError }, { status: 404 });
  }

  try {
    const scan = await prisma.roomScan.create({
      data: {
        contractorId: session.user.id,
        customerId: customerId || null,
        quoteId: quoteId || null,
        roomsData: roomsData as object[],
        surfaceCount: typeof surfaceCount === "number" ? Math.max(0, Math.floor(surfaceCount)) : 0,
        notes: notes || null,
      },
    });

    return NextResponse.json(scan, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save scan" }, { status: 500 });
  }
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

  try {
    const scans = await prisma.roomScan.findMany({
      where,
      orderBy: { scanDate: "desc" },
      take: 50,
    });

    return NextResponse.json(scans);
  } catch {
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}
