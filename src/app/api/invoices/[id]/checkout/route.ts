/**
 * POST /api/invoices/[id]/checkout
 *
 * Creates a Stripe Checkout Session for a customer to pay an invoice online.
 * Returns the checkout URL that can be shared with the customer.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id, contractorId: session.user.id },
    include: {
      customer: true,
      contractor: true,
      quote: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
  }

  const amountDue = Math.round((invoice.amount - invoice.paidAmount) * 100); // cents
  if (amountDue <= 0) {
    return NextResponse.json({ error: "No amount due" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const baseUrl = process.env.NEXTAUTH_URL || "https://probuildcalc.com";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `${invoice.contractor.companyName} — Quote ${invoice.quote.quoteNumber}`,
            },
            unit_amount: amountDue,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        contractorId: invoice.contractorId,
        type: "invoice_payment",
      },
      customer_email: invoice.customer.email || undefined,
      success_url: `${baseUrl}/pay/success?invoice=${invoice.invoiceNumber}`,
      cancel_url: `${baseUrl}/pay/cancel`,
    });

    // Store payment link on the invoice
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripePaymentLink: checkoutSession.url },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      invoiceNumber: invoice.invoiceNumber,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 });
  }
}
