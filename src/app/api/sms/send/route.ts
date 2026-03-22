/**
 * POST /api/sms/send — Send SMS notification to a customer
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSMS, formatQuoteSentSMS, formatJobReminderSMS } from "@/lib/sms";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, customerId, quoteId, jobId } = body;

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });
  if (!contractor) {
    return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
  }

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, contractorId: session.user.id },
  });
  if (!customer || !customer.phone) {
    return NextResponse.json(
      { error: "Customer not found or no phone number" },
      { status: 400 }
    );
  }

  let message = "";

  if (type === "quote_sent" && quoteId) {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, contractorId: session.user.id },
    });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    const publicUrl = `${process.env.NEXTAUTH_URL || "https://probuildcalc.com"}/quote/${quote.publicToken}`;
    message = formatQuoteSentSMS(
      contractor.companyName,
      customer.name,
      quote.quoteNumber,
      quote.total,
      publicUrl
    );
  } else if (type === "job_reminder" && jobId) {
    const job = await prisma.job.findFirst({
      where: { id: jobId, contractorId: session.user.id },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    const dateStr = job.scheduledDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    message = formatJobReminderSMS(customer.name, contractor.companyName, dateStr);
  } else if (type === "custom" && body.message) {
    message = body.message;
  } else {
    return NextResponse.json({ error: "Invalid SMS type" }, { status: 400 });
  }

  const result = await sendSMS(customer.phone, message);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, message });
}
