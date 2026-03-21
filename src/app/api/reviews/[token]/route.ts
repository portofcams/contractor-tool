/**
 * GET /api/reviews/[token] — Get review details (public)
 * POST /api/reviews/[token] — Submit a review (public)
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const review = await prisma.review.findUnique({
    where: { token },
    include: {
      contractor: { select: { companyName: true, trade: true } },
      customer: { select: { name: true } },
    },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: review.id,
    companyName: review.contractor.companyName,
    trade: review.contractor.trade,
    customerName: review.customer.name,
    rating: review.rating,
    comment: review.comment,
    submittedAt: review.submittedAt,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const review = await prisma.review.findUnique({ where: { token } });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.submittedAt) {
    return NextResponse.json(
      { error: "Review already submitted" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { rating, comment } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be 1-5" },
      { status: 400 }
    );
  }

  const updated = await prisma.review.update({
    where: { token },
    data: {
      rating,
      comment: comment || null,
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, review: updated });
}
