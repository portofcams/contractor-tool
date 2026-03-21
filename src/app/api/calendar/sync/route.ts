/**
 * POST /api/calendar/sync — Sync a job to Google Calendar
 *
 * Requires the contractor to have signed in via Google OAuth.
 * Uses the Google Calendar API to create/update events.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { jobId } = body;

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const job = await prisma.job.findFirst({
    where: { id: jobId, contractorId: session.user.id },
    include: {
      customer: { select: { name: true, address: true, phone: true } },
      quote: { select: { quoteNumber: true, trade: true, total: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Build a Google Calendar event URL (opens in browser to add)
  const title = encodeURIComponent(
    `${job.quote.trade.charAt(0).toUpperCase() + job.quote.trade.slice(1)} - ${job.customer.name}`
  );
  const details = encodeURIComponent(
    `Quote: ${job.quote.quoteNumber}\nTotal: $${job.quote.total.toFixed(2)}\nCustomer: ${job.customer.name}${job.customer.phone ? `\nPhone: ${job.customer.phone}` : ""}${job.notes ? `\nNotes: ${job.notes}` : ""}`
  );
  const location = encodeURIComponent(job.customer.address || "");

  const startDate = job.scheduledDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const endDate = job.scheduledEnd
    ? job.scheduledEnd.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    : new Date(job.scheduledDate.getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;

  return NextResponse.json({ calendarUrl });
}
