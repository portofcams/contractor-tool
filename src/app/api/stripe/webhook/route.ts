/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events to keep subscription data in sync.
 *
 * Events handled:
 *   - checkout.session.completed → set stripeCustomerId + subscriptionPlan
 *   - customer.subscription.updated → update plan on upgrade/downgrade
 *   - customer.subscription.deleted → revert to free plan
 *
 * Setup:
 *   1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
 *   2. URL: https://yourdomain.com/api/stripe/webhook
 *   3. Events: checkout.session.completed, customer.subscription.updated,
 *      customer.subscription.deleted
 *   4. Copy the Signing Secret → STRIPE_WEBHOOK_SECRET in .env
 *
 *   For local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const contractorId = session.metadata?.contractorId;
      const planId = session.metadata?.planId;
      const stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      if (contractorId && planId && stripeCustomerId) {
        await prisma.contractor.update({
          where: { id: contractorId },
          data: {
            subscriptionPlan: planId,
            stripeCustomerId,
          },
        });
        console.log(
          `Checkout complete: contractor ${contractorId} → ${planId}`
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      // Find contractor by Stripe customer ID
      const contractor = await prisma.contractor.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (contractor) {
        // Determine plan from the subscription's metadata or price
        const planId =
          subscription.metadata?.planId ||
          determinePlanFromSubscription(subscription);

        if (subscription.status === "active" || subscription.status === "trialing") {
          await prisma.contractor.update({
            where: { id: contractor.id },
            data: { subscriptionPlan: planId },
          });
          console.log(
            `Subscription updated: contractor ${contractor.id} → ${planId} (${subscription.status})`
          );
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const contractor = await prisma.contractor.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (contractor) {
        await prisma.contractor.update({
          where: { id: contractor.id },
          data: { subscriptionPlan: "free" },
        });
        console.log(
          `Subscription canceled: contractor ${contractor.id} → free`
        );
      }
      break;
    }

    default:
      // Unhandled event type — ignore
      break;
  }

  return NextResponse.json({ received: true });
}

/**
 * Fallback: determine plan from the subscription's price ID
 * when metadata isn't available (e.g., plan changed via Stripe Dashboard).
 */
function determinePlanFromSubscription(
  subscription: Stripe.Subscription
): string {
  const priceId = subscription.items.data[0]?.price?.id;
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
  return "free";
}
