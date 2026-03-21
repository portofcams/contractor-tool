/**
 * GET /api/quotes/[id]/revisions — list revision history
 * POST /api/quotes/[id]/revisions — save current state as revision before editing
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quote = await prisma.quote.findFirst({
    where: { id, contractorId: session.user.id },
    select: { id: true },
  });
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const revisions = await prisma.quoteRevision.findMany({
    where: { quoteId: id },
    orderBy: { version: "desc" },
  });

  return NextResponse.json(revisions);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quote = await prisma.quote.findFirst({
    where: { id, contractorId: session.user.id },
  });
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  let changeNote: string | null = null;
  try {
    const body = await req.json();
    changeNote = body.changeNote || null;
  } catch {
    // No body is fine
  }

  // Save current state as a revision
  const revision = await prisma.quoteRevision.create({
    data: {
      quoteId: id,
      version: quote.version,
      materials: quote.materials as object,
      subtotal: quote.subtotal,
      laborCost: quote.laborCost,
      markupPercent: quote.markupPercent,
      taxRate: quote.taxRate,
      total: quote.total,
      changeNote,
    },
  });

  // Increment version on the quote
  await prisma.quote.update({
    where: { id },
    data: { version: quote.version + 1 },
  });

  return NextResponse.json(revision, { status: 201 });
}
