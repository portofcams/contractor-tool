/**
 * POST /api/site-notes   — Create a note
 * GET  /api/site-notes   — List notes (filtered by customerId/quoteId)
 * PATCH /api/site-notes   — Update a note (pass id in body)
 * DELETE /api/site-notes  — Delete a note (pass id in body)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Max note content length */
const MAX_CONTENT_LENGTH = 10000;

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

  const { customerId, quoteId, content } = body as {
    customerId?: string;
    quoteId?: string;
    content?: string;
  };

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: `Content too long (max ${MAX_CONTENT_LENGTH} chars)` }, { status: 400 });
  }

  // IDOR: verify ownership of customerId/quoteId
  const ownershipError = await verifyOwnership(session.user.id, customerId, quoteId);
  if (ownershipError) {
    return NextResponse.json({ error: ownershipError }, { status: 404 });
  }

  try {
    const note = await prisma.siteNote.create({
      data: {
        contractorId: session.user.id,
        customerId: customerId || null,
        quoteId: quoteId || null,
        content: content.trim(),
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
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
    const notes = await prisma.siteNote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

  const { id, content } = body as { id?: string; content?: string };

  if (!id || !content) {
    return NextResponse.json({ error: "id and content required" }, { status: 400 });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: `Content too long (max ${MAX_CONTENT_LENGTH} chars)` }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.siteNote.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  try {
    const updated = await prisma.siteNote.update({
      where: { id },
      data: { content: content.trim() },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

  const { id } = body as { id?: string };

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const existing = await prisma.siteNote.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  try {
    await prisma.siteNote.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
