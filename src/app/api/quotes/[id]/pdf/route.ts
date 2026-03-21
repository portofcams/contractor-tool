/**
 * GET /api/quotes/[id]/pdf
 *
 * Generates and returns the quote as a PDF file.
 * The browser will download it with the quote number as filename.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderQuotePDF } from "@/lib/pdf/render";
import { uploadFile } from "@/lib/storage";

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
    include: {
      customer: true,
      contractor: true,
      sitePhotos: { orderBy: { takenAt: "desc" }, take: 4 },
      roomScans: { select: { roomsData: true } },
    },
  });

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const pdfBuffer = await renderQuotePDF(quote);

  const fileName = `${quote.quoteNumber}.pdf`;
  const { url: pdfUrl } = await uploadFile(Buffer.from(pdfBuffer), "pdfs", "pdf", "application/pdf");

  if (quote.pdfUrl !== pdfUrl) {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { pdfUrl },
    });
  }

  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(uint8.length),
    },
  });
}
