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
import { sendQuoteNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 10 });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const limited = limiter.check(req);
  if (limited) return limited;

  const { token } = await params;
  const body = await req.json();
  const { action, signatureData } = body;

  if (!action || !["accept", "decline"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Validate signatureData size (max 500KB base64)
  if (signatureData && (typeof signatureData !== "string" || signatureData.length > 500_000)) {
    return NextResponse.json({ error: "Signature data too large" }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({
    where: { publicToken: token },
    include: {
      customer: { select: { name: true } },
      contractor: { select: { email: true, companyName: true, notifyOnAccept: true, notifyOnDecline: true } },
    },
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

  const newStatus = action === "accept" ? "accepted" : "rejected";

  if (action === "accept") {
    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
        signatureData: signatureData || null,
      },
    });
  } else {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: "rejected" },
    });
  }

  // Send email notification to contractor (respecting preferences)
  const shouldNotify =
    (action === "accept" && quote.contractor.notifyOnAccept) ||
    (action === "decline" && quote.contractor.notifyOnDecline);

  if (shouldNotify) {
    sendQuoteNotification({
      to: quote.contractor.email,
      companyName: quote.contractor.companyName,
      customerName: quote.customer.name,
      quoteNumber: quote.quoteNumber,
      total: quote.total,
      action: action === "accept" ? "accepted" : "declined",
    }).catch((err) => console.error("Failed to send notification:", err));
  }

  return NextResponse.json({ status: newStatus });
}
