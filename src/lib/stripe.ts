/**
 * Stripe Configuration — ContractorCalc
 *
 * Centralizes Stripe SDK setup and plan definitions.
 *
 * Setup:
 *   1. Create a Stripe account at stripe.com
 *   2. In the Stripe Dashboard, create two Products:
 *      - "ContractorCalc Pro"     → $29/mo recurring price
 *      - "ContractorCalc Business" → $49/mo recurring price
 *   3. Copy the Price IDs (price_xxx) into your .env:
 *      STRIPE_PRICE_PRO=price_xxx
 *      STRIPE_PRICE_BUSINESS=price_xxx
 *   4. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env
 *
 * Plan logic:
 *   - Free: 5 quotes/month, no credit card needed
 *   - Pro ($29/mo): Unlimited quotes, 1 trade, 14-day free trial
 *   - Business ($49/mo): Unlimited quotes, all trades, 14-day free trial
 */

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to your .env file."
      );
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** @deprecated Use getStripe() for lazy initialization */
export const stripe = null as unknown as Stripe;

// ── Plan Definitions ──

export type PlanId = "free" | "pro" | "business";

export interface PlanInfo {
  id: PlanId;
  name: string;
  price: number; // monthly in dollars
  priceId: string; // Stripe Price ID
  quotesPerMonth: number | null; // null = unlimited
  trades: number | null; // null = all
  features: string[];
}

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: "",
    quotesPerMonth: 5,
    trades: null,
    features: [
      "5 quotes per month",
      "All trade calculators",
      "PDF generation",
      "Email quotes",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRICE_PRO || "",
    quotesPerMonth: null,
    trades: 1,
    features: [
      "Unlimited quotes",
      "1 trade type",
      "PDF generation",
      "Email quotes",
      "Quote tracking",
      "Priority support",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: 49,
    priceId: process.env.STRIPE_PRICE_BUSINESS || "",
    quotesPerMonth: null,
    trades: null,
    features: [
      "Unlimited quotes",
      "All trade types",
      "PDF generation",
      "Email quotes",
      "Quote tracking",
      "Priority support",
      "Custom branding",
    ],
  },
};

// ── Helpers ──

export function getPlan(planId: string): PlanInfo {
  return PLANS[planId as PlanId] || PLANS.free;
}

export function getQuotesRemaining(
  planId: string,
  quotesThisMonth: number
): number | null {
  const plan = getPlan(planId);
  if (plan.quotesPerMonth === null) return null; // unlimited
  return Math.max(0, plan.quotesPerMonth - quotesThisMonth);
}

export function isAtQuoteLimit(
  planId: string,
  quotesThisMonth: number
): boolean {
  const remaining = getQuotesRemaining(planId, quotesThisMonth);
  return remaining !== null && remaining <= 0;
}

// 14-day trial period in seconds
export const TRIAL_PERIOD_DAYS = 14;
