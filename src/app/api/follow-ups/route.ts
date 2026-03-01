import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { quoteId, reminderDate, message } = body as { quoteId?: string; reminderDate?: string; message?: string };

  if (!quoteId || !reminderDate) {
    return NextResponse.json({ error: "quoteId and reminderDate required" }, { status: 400 });
  }

  const quote = await prisma.quote.findFirst({ where: { id: quoteId, contractorId: session.user.id } });
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  try {
    const followUp = await prisma.followUp.create({
      data: {
        contractorId: session.user.id,
        quoteId,
        reminderDate: new Date(reminderDate),
        message: message || null,
      },
    });
    return NextResponse.json(followUp, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { contractorId: session.user.id };
  if (status) where.status = status;

  const followUps = await prisma.followUp.findMany({
    where,
    include: { quote: { include: { customer: true } } },
    orderBy: { reminderDate: "asc" },
    take: 50,
  });
  return NextResponse.json(followUps);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id, status } = body as { id?: string; status?: string };
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const validStatuses = ["pending", "sent", "dismissed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.followUp.findFirst({ where: { id, contractorId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.followUp.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}
