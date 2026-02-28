/**
 * POST /api/quotes/[id]/send
 *
 * Generates the quote PDF, emails it to the customer,
 * and updates the quote status to "sent".
 *
 * Request body (optional):
 *   { "email": "override@example.com" }
 *   If no email provided, uses the customer's email on file.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderQuotePDF } from "@/lib/pdf/render";
import { sendQuoteEmail } from "@/lib/email";

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
    include: { customer: true, contractor: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  // Determine recipient email
  let recipientEmail: string;
  try {
    const body = await req.json().catch(() => ({}));
    recipientEmail = (body as { email?: string }).email || quote.customer.email || "";
  } catch {
    recipientEmail = quote.customer.email || "";
  }

  if (!recipientEmail) {
    return NextResponse.json(
      { error: "No email address for this customer. Add an email first." },
      { status: 400 }
    );
  }

  // Generate PDF
  const pdfBuffer = await renderQuotePDF(quote);

  // Send email
  const result = await sendQuoteEmail({
    to: recipientEmail,
    customerName: quote.customer.name,
    companyName: quote.contractor.companyName,
    quoteNumber: quote.quoteNumber,
    total: quote.total,
    trade: quote.trade,
    pdfBuffer,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to send email" },
      { status: 500 }
    );
  }

  // Update quote status
  await prisma.quote.update({
    where: { id: quote.id },
    data: {
      status: quote.status === "draft" ? "sent" : quote.status,
      sentAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    sentTo: recipientEmail,
  });
}
