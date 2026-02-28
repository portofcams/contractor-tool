/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for upgrading to Pro or Business.
 * Includes a 14-day free trial (no charge until trial ends).
 *
 * Request body: { "planId": "pro" | "business" }
 * Response: { "url": "https://checkout.stripe.com/..." }
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe, PLANS, TRIAL_PERIOD_DAYS, type PlanId } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const planId = body.planId as PlanId;

  if (!planId || !PLANS[planId] || planId === "free") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = PLANS[planId];
  if (!plan.priceId) {
    return NextResponse.json(
      { error: "Stripe Price ID not configured for this plan" },
      { status: 500 }
    );
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });

  if (!contractor) {
    return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
  }

  // If they already have a Stripe customer, reuse it
  const customerParams: Record<string, string> = {};
  if (contractor.stripeCustomerId) {
    customerParams.customer = contractor.stripeCustomerId;
  } else {
    customerParams.customer_email = contractor.email;
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    ...customerParams,
    mode: "subscription",
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: TRIAL_PERIOD_DAYS,
      metadata: {
        contractorId: contractor.id,
        planId,
      },
    },
    metadata: {
      contractorId: contractor.id,
      planId,
    },
    success_url: `${process.env.NEXTAUTH_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings/billing?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
