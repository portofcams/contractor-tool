/**
 * SMS Service — ProBuildCalc
 *
 * Sends transactional SMS via Twilio.
 * Setup: Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
 */

import twilio from "twilio";

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

export async function sendSMS(
  to: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  if (!client || !FROM_NUMBER) {
    console.log("═══ SMS (dev mode — no Twilio config) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Body: ${body}`);
    console.log("═══════════════════════════════════════════");
    return { success: true };
  }

  try {
    await client.messages.create({ body, from: FROM_NUMBER, to });
    return { success: true };
  } catch (err) {
    console.error("SMS send error:", err);
    return { success: false, error: String(err) };
  }
}

export function formatQuoteSentSMS(
  companyName: string,
  customerName: string,
  quoteNumber: string,
  total: number,
  publicUrl: string
): string {
  const totalStr = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Hi ${customerName}, ${companyName} sent you Quote ${quoteNumber} ($${totalStr}). View it here: ${publicUrl}`;
}

export function formatQuoteAcceptedSMS(
  customerName: string,
  quoteNumber: string
): string {
  return `${customerName} accepted Quote ${quoteNumber}! Check your dashboard for details.`;
}

export function formatJobReminderSMS(
  customerName: string,
  companyName: string,
  date: string
): string {
  return `Hi ${customerName}, reminder: ${companyName} has a job scheduled for ${date}. See you then!`;
}
