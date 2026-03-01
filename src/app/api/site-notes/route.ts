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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customerId, quoteId, content } = await req.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const note = await prisma.siteNote.create({
    data: {
      contractorId: session.user.id,
      customerId: customerId || null,
      quoteId: quoteId || null,
      content: content.trim(),
    },
  });

  return NextResponse.json(note, { status: 201 });
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

  const notes = await prisma.siteNote.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(notes);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, content } = await req.json();

  if (!id || !content) {
    return NextResponse.json({ error: "id and content required" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.siteNote.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const updated = await prisma.siteNote.update({
    where: { id },
    data: { content: content.trim() },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const existing = await prisma.siteNote.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.siteNote.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
