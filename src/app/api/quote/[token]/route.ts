/**
 * POST /api/quote/[token]
 *
 * Public API for customer to accept or decline a quote.
 * No auth required — uses the unique public token.
 *
 * Body: { action: "accept" | "decline", signatureData?: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json();
  const { action, signatureData } = body;

  if (!action || !["accept", "decline"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({
    where: { publicToken: token },
  });

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  if (quote.status === "accepted" || quote.status === "rejected") {
    return NextResponse.json(
      { error: "Quote has already been responded to" },
      { status: 400 }
    );
  }

  if (action === "accept") {
    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
        signatureData: signatureData || null,
      },
    });
    return NextResponse.json({ status: "accepted" });
  }

  // decline
  await prisma.quote.update({
    where: { id: quote.id },
    data: { status: "rejected" },
  });
  return NextResponse.json({ status: "rejected" });
}
