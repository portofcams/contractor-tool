import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const customer = await prisma.customer.findFirst({
    where: { portalToken: token },
    include: {
      quotes: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          quoteNumber: true,
          publicToken: true,
          trade: true,
          total: true,
          status: true,
          sentAt: true,
          createdAt: true,
        },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          amount: true,
          paidAmount: true,
          status: true,
          dueDate: true,
          stripePaymentLink: true,
          createdAt: true,
        },
      },
      jobs: {
        orderBy: { scheduledDate: "desc" },
        include: {
          quote: {
            select: { trade: true, quoteNumber: true },
          },
        },
      },
    },
  });

  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: customer.contractorId },
    select: { companyName: true, phone: true, email: true },
  });

  return NextResponse.json({
    customer: {
      name: customer.name,
      email: customer.email,
    },
    contractor: {
      companyName: contractor?.companyName,
      phone: contractor?.phone,
      email: contractor?.email,
    },
    quotes: customer.quotes,
    invoices: customer.invoices,
    jobs: customer.jobs.map((j) => ({
      id: j.id,
      status: j.status,
      scheduledDate: j.scheduledDate,
      trade: j.quote.trade,
      quoteNumber: j.quote.quoteNumber,
    })),
  });
}
