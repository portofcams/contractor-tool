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

  const { quoteId, dueDate } = body as { quoteId?: string; dueDate?: string };

  if (!quoteId || !dueDate) {
    return NextResponse.json({ error: "quoteId and dueDate required" }, { status: 400 });
  }

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, contractorId: session.user.id },
    include: { customer: true },
  });
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  // Generate invoice number
  const count = await prisma.invoice.count({ where: { contractorId: session.user.id } });
  const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        contractorId: session.user.id,
        quoteId,
        customerId: quote.customerId,
        invoiceNumber,
        amount: quote.total,
        dueDate: new Date(dueDate),
      },
      include: { customer: true, quote: true },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
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

  const invoices = await prisma.invoice.findMany({
    where,
    include: { customer: true, quote: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}
