import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderQuotePDF } from "@/lib/pdf/render";
import { sendQuoteEmail } from "@/lib/email";
import { createAutoFollowUps } from "@/lib/follow-up-sequence";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quoteIds } = (await req.json()) as { quoteIds: string[] };

  if (!Array.isArray(quoteIds) || quoteIds.length === 0) {
    return NextResponse.json({ error: "No quotes selected" }, { status: 400 });
  }

  if (quoteIds.length > 50) {
    return NextResponse.json({ error: "Maximum 50 quotes per batch" }, { status: 400 });
  }

  const quotes = await prisma.quote.findMany({
    where: {
      id: { in: quoteIds },
      contractorId: session.user.id,
      status: "draft",
    },
    include: {
      customer: true,
      contractor: true,
      sitePhotos: { orderBy: { takenAt: "desc" }, take: 4 },
    },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const quote of quotes) {
    const email = quote.customer.email;
    if (!email) {
      errors.push(`${quote.quoteNumber}: No email for ${quote.customer.name}`);
      continue;
    }

    try {
      const pdfBuffer = await renderQuotePDF(quote);
      const result = await sendQuoteEmail({
        to: email,
        customerName: quote.customer.name,
        companyName: quote.contractor.companyName,
        quoteNumber: quote.quoteNumber,
        total: quote.total,
        trade: quote.trade,
        pdfBuffer,
      });

      if (!result.success) {
        errors.push(`${quote.quoteNumber}: ${result.error || "Send failed"}`);
        continue;
      }

      await prisma.quote.update({
        where: { id: quote.id },
        data: { status: "sent", sentAt: new Date() },
      });

      createAutoFollowUps(quote.id, session.user.id).catch((err) =>
        console.error("Auto follow-up error:", err)
      );

      sent++;
    } catch (err) {
      errors.push(`${quote.quoteNumber}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    sent,
    failed: errors.length,
    errors,
    skipped: quoteIds.length - quotes.length,
  });
}
