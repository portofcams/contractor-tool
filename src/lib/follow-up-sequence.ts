/**
 * Auto Follow-Up Sequence Logic
 *
 * Creates automated follow-up reminders when a quote is sent.
 * Default sequence: 3 days, 7 days, 14 days after sending.
 * Contractors can customize the sequence in settings.
 */

import { prisma } from "@/lib/db";

export interface SequenceStep {
  delayDays: number;
  message: string;
}

export const DEFAULT_SEQUENCE: SequenceStep[] = [
  { delayDays: 3, message: "Just checking in — have you had a chance to review the quote?" },
  { delayDays: 7, message: "Following up on the quote I sent last week. Happy to answer any questions." },
  { delayDays: 14, message: "Wanted to touch base one last time about this quote. Let me know if you'd like to proceed or discuss any changes." },
];

/**
 * Create auto follow-up reminders for a quote based on the contractor's sequence.
 * Called when a quote is emailed/sent.
 */
export async function createAutoFollowUps(quoteId: string, contractorId: string) {
  const contractor = await prisma.contractor.findUnique({
    where: { id: contractorId },
    select: { autoFollowUp: true, followUpSequence: true },
  });

  if (!contractor?.autoFollowUp) return;

  const sequence: SequenceStep[] =
    (contractor.followUpSequence as SequenceStep[] | null) || DEFAULT_SEQUENCE;

  if (sequence.length === 0) return;

  // Don't create duplicates — check if auto follow-ups already exist for this quote
  const existing = await prisma.followUp.count({
    where: { quoteId, isAuto: true, status: "pending" },
  });
  if (existing > 0) return;

  const now = new Date();
  const followUps = sequence.map((step, index) => {
    const reminderDate = new Date(now);
    reminderDate.setDate(reminderDate.getDate() + step.delayDays);
    return {
      contractorId,
      quoteId,
      reminderDate,
      message: step.message,
      isAuto: true,
      stepIndex: index,
    };
  });

  await prisma.followUp.createMany({ data: followUps });
}

/**
 * Dismiss all pending auto follow-ups for a quote.
 * Called when a quote is accepted or rejected.
 */
export async function dismissAutoFollowUps(quoteId: string) {
  await prisma.followUp.updateMany({
    where: { quoteId, isAuto: true, status: "pending" },
    data: { status: "dismissed" },
  });
}
