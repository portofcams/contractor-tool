/**
 * GET /api/reviews — List reviews for the logged-in contractor
 * POST /api/reviews — Create a review request (sends email to customer)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { contractorId: session.user.id },
    include: { customer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { customerId, quoteId } = body;

  if (!customerId || !quoteId) {
    return NextResponse.json(
      { error: "customerId and quoteId required" },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, contractorId: session.user.id },
  });
  if (!customer || !customer.email) {
    return NextResponse.json(
      { error: "Customer not found or no email" },
      { status: 400 }
    );
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });
  if (!contractor) {
    return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
  }

  // Check for existing review request
  const existing = await prisma.review.findFirst({
    where: { contractorId: session.user.id, customerId, quoteId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Review already requested for this quote" },
      { status: 409 }
    );
  }

  const review = await prisma.review.create({
    data: { contractorId: session.user.id, customerId, quoteId },
  });

  // Send review request email
  const reviewUrl = `${process.env.NEXTAUTH_URL || "https://probuildcalc.com"}/review/${review.token}`;
  await sendReviewRequestEmail({
    to: customer.email,
    customerName: customer.name,
    companyName: contractor.companyName,
    reviewUrl,
  });

  return NextResponse.json(review, { status: 201 });
}
