/**
 * GET /api/usage
 *
 * Returns the current user's plan info and quotes used this month.
 * Used by client components to check limits before creating quotes.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlan, getQuotesRemaining, isAtQuoteLimit } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });

  if (!contractor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const quotesThisMonth = await prisma.quote.count({
    where: {
      contractorId: contractor.id,
      createdAt: { gte: thisMonth },
    },
  });

  const plan = getPlan(contractor.subscriptionPlan);

  return NextResponse.json({
    planId: plan.id,
    planName: plan.name,
    quotesThisMonth,
    quotesLimit: plan.quotesPerMonth,
    quotesRemaining: getQuotesRemaining(contractor.subscriptionPlan, quotesThisMonth),
    isAtLimit: isAtQuoteLimit(contractor.subscriptionPlan, quotesThisMonth),
  });
}
