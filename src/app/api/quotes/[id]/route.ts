import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dismissAutoFollowUps } from "@/lib/follow-up-sequence";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quote = await prisma.quote.findFirst({
    where: { id, contractorId: session.user.id },
    include: { customer: true, contractor: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Only allow updating safe fields
  const allowedFields: Record<string, unknown> = {};
  if (typeof body.status === "string" && ["draft", "sent", "accepted", "rejected"].includes(body.status)) {
    allowedFields.status = body.status;
    if (body.status === "accepted") {
      allowedFields.acceptedAt = new Date();
    }
  }
  if (body.recurrence !== undefined) {
    const validRecurrences = ["weekly", "monthly", "quarterly"];
    if (body.recurrence === null || body.recurrence === "") {
      allowedFields.recurrence = null;
      allowedFields.nextRecurrenceAt = null;
    } else if (validRecurrences.includes(body.recurrence)) {
      allowedFields.recurrence = body.recurrence;
      const next = new Date();
      if (body.recurrence === "weekly") next.setDate(next.getDate() + 7);
      else if (body.recurrence === "monthly") next.setMonth(next.getMonth() + 1);
      else if (body.recurrence === "quarterly") next.setMonth(next.getMonth() + 3);
      allowedFields.nextRecurrenceAt = next;
    }
  }

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const quote = await prisma.quote.updateMany({
    where: { id, contractorId: session.user.id },
    data: allowedFields,
  });

  if (quote.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Dismiss auto follow-ups when quote is accepted or rejected
  if (allowedFields.status === "accepted" || allowedFields.status === "rejected") {
    dismissAutoFollowUps(id).catch((err) =>
      console.error("Failed to dismiss auto follow-ups:", err)
    );
  }

  return NextResponse.json({ success: true });
}
