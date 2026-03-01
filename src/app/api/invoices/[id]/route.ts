import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({ where: { id, contractorId: session.user.id } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { paidAmount, status } = body as { paidAmount?: number; status?: string };

  const data: Record<string, unknown> = {};
  if (typeof paidAmount === "number") {
    data.paidAmount = paidAmount;
    if (paidAmount >= invoice.amount) {
      data.status = "paid";
      data.paidAt = new Date();
    } else if (paidAmount > 0) {
      data.status = "partial";
    }
  }
  if (status) data.status = status;
  if (status === "paid") data.paidAt = new Date();

  const updated = await prisma.invoice.update({
    where: { id },
    data,
    include: { customer: true, quote: true },
  });
  return NextResponse.json(updated);
}
