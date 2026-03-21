/**
 * Email Service — ContractorCalc
 *
 * Sends transactional emails via Resend.
 * Primary use: emailing quote PDFs to customers.
 *
 * Setup:
 *   1. Sign up at resend.com
 *   2. Add and verify your sending domain
 *   3. Create an API key
 *   4. Set RESEND_API_KEY in .env
 *
 * The "from" address uses the verified domain from Resend.
 * In development without a key, emails are logged to console.
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Use Resend's test domain in development
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface SendQuoteEmailParams {
  to: string;
  customerName: string;
  companyName: string;
  quoteNumber: string;
  total: number;
  trade: string;
  pdfBuffer: Buffer;
}

export async function sendQuoteEmail(params: SendQuoteEmailParams): Promise<{ success: boolean; error?: string }> {
  const {
    to,
    customerName,
    companyName,
    quoteNumber,
    total,
    trade,
    pdfBuffer,
  } = params;

  const safeCompany = escapeHtml(companyName);
  const safeCustomer = escapeHtml(customerName);
  const safeTrade = escapeHtml(trade);
  const safeQuoteNum = escapeHtml(quoteNumber);

  const subject = `Quote ${safeQuoteNum} from ${safeCompany}`;
  const tradeName = safeTrade.charAt(0).toUpperCase() + safeTrade.slice(1);
  const totalFormatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e40af; padding:30px 40px;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">${safeCompany}</h1>
              <p style="margin:4px 0 0; color:#93c5fd; font-size:14px;">${tradeName} Services</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#111827; font-size:16px; line-height:1.6;">
                Hi ${safeCustomer},
              </p>
              <p style="margin:0 0 20px; color:#374151; font-size:14px; line-height:1.6;">
                Thank you for the opportunity to provide a quote for your ${tradeName.toLowerCase()} project. Please find the details attached.
              </p>

              <!-- Quote summary box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff; border:1px solid #bfdbfe; border-radius:8px; margin:0 0 24px;">
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:1px; padding-bottom:8px;">Quote Number</td>
                        <td style="color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:1px; padding-bottom:8px;" align="right">Total</td>
                      </tr>
                      <tr>
                        <td style="color:#111827; font-size:18px; font-weight:700;">${safeQuoteNum}</td>
                        <td style="color:#1e40af; font-size:24px; font-weight:700;" align="right">$${totalFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px; color:#374151; font-size:14px; line-height:1.6;">
                The full quote with materials breakdown is attached as a PDF. This quote is valid for 30 days.
              </p>

              <p style="margin:0 0 8px; color:#374151; font-size:14px; line-height:1.6;">
                If you have any questions or would like to proceed, just reply to this email or give us a call.
              </p>

              <p style="margin:24px 0 0; color:#111827; font-size:14px; line-height:1.6;">
                Best regards,<br>
                <strong>${safeCompany}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:20px 40px; border-top:1px solid #e5e7eb;">
              <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center;">
                Sent via ContractorCalc &mdash; Professional quotes in 30 seconds
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // If no API key, log to console (development)
  if (!resend) {
    console.log("═══ EMAIL (dev mode — no RESEND_API_KEY) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  PDF size: ${pdfBuffer.length} bytes`);
    console.log("═══════════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
      attachments: [
        {
          filename: `${safeQuoteNum}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send notification to contractor when a customer views their quote.
 */
interface QuoteViewedParams {
  to: string;
  companyName: string;
  customerName: string;
  quoteNumber: string;
  total: number;
}

export async function sendQuoteViewedNotification(params: QuoteViewedParams): Promise<{ success: boolean; error?: string }> {
  const { to, companyName, customerName, quoteNumber, total } = params;

  const safeCompany = escapeHtml(companyName);
  const safeCustomer = escapeHtml(customerName);
  const safeQuoteNum = escapeHtml(quoteNumber);
  const totalFormatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const subject = `${customerName} viewed Quote ${quoteNumber}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background-color:#1e293b; padding:30px 40px; border-bottom:1px solid #334155;">
              <h1 style="margin:0; color:#3b82f6; font-size:20px; font-weight:700;">ContractorCalc</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#f1f5f9; font-size:16px; line-height:1.6;">
                Hi ${safeCompany},
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#172554; border:1px solid #1e40af; border-radius:8px; margin:0 0 24px;">
                <tr>
                  <td style="padding:20px; text-align:center;">
                    <p style="margin:0 0 4px; color:#60a5fa; font-size:24px; font-weight:700;">Viewed</p>
                    <p style="margin:0; color:#94a3b8; font-size:14px;">
                      ${safeCustomer} just opened Quote ${safeQuoteNum} &mdash; $${totalFormatted}
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0; color:#9ca3af; font-size:14px; line-height:1.6;">
                Now might be a good time to follow up while the quote is fresh in their mind.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#020617; padding:20px 40px; border-top:1px solid #334155;">
              <p style="margin:0; color:#6b7280; font-size:12px; text-align:center;">
                ContractorCalc &mdash; Professional quotes in 30 seconds
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (!resend) {
    console.log("═══ VIEW NOTIFICATION (dev mode) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log("═════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error("View notification email error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send notification to contractor when a customer accepts or declines a quote.
 */
interface QuoteNotificationParams {
  to: string;
  companyName: string;
  customerName: string;
  quoteNumber: string;
  total: number;
  action: "accepted" | "declined";
}

export async function sendQuoteNotification(params: QuoteNotificationParams): Promise<{ success: boolean; error?: string }> {
  const { to, companyName, customerName, quoteNumber, total, action } = params;

  const safeCompany = escapeHtml(companyName);
  const safeCustomer = escapeHtml(customerName);
  const safeQuoteNum = escapeHtml(quoteNumber);

  const isAccepted = action === "accepted";
  const subject = `Quote ${quoteNumber} ${action} by ${customerName}`;
  const totalFormatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const statusColor = isAccepted ? "#16a34a" : "#dc2626";
  const statusBg = isAccepted ? "#f0fdf4" : "#fef2f2";
  const statusBorder = isAccepted ? "#bbf7d0" : "#fecaca";
  const statusText = isAccepted ? "Accepted" : "Declined";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e293b; padding:30px 40px; border-bottom:1px solid #334155;">
              <h1 style="margin:0; color:#3b82f6; font-size:20px; font-weight:700;">ContractorCalc</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#f1f5f9; font-size:16px; line-height:1.6;">
                Hi ${safeCompany},
              </p>
              <p style="margin:0 0 24px; color:#9ca3af; font-size:14px; line-height:1.6;">
                ${safeCustomer} has responded to your quote.
              </p>

              <!-- Status box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${statusBg}; border:1px solid ${statusBorder}; border-radius:8px; margin:0 0 24px;">
                <tr>
                  <td style="padding:20px; text-align:center;">
                    <p style="margin:0 0 4px; color:${statusColor}; font-size:24px; font-weight:700;">
                      ${statusText}
                    </p>
                    <p style="margin:0; color:#6b7280; font-size:14px;">
                      Quote ${safeQuoteNum} &mdash; $${totalFormatted}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px; color:#9ca3af; font-size:14px; line-height:1.6;">
                ${isAccepted
                  ? "Great news! The customer has signed and accepted the quote. You can view the signed copy in your dashboard."
                  : "The customer has declined this quote. You can follow up or send a revised quote from your dashboard."}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#020617; padding:20px 40px; border-top:1px solid #334155;">
              <p style="margin:0; color:#6b7280; font-size:12px; text-align:center;">
                ContractorCalc &mdash; Professional quotes in 30 seconds
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (!resend) {
    console.log("═══ NOTIFICATION EMAIL (dev mode) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Action: ${action}`);
    console.log("═════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("Notification email error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send review request email to customer after job completion.
 */
interface ReviewRequestParams {
  to: string;
  customerName: string;
  companyName: string;
  reviewUrl: string;
}

export async function sendReviewRequestEmail(params: ReviewRequestParams): Promise<{ success: boolean; error?: string }> {
  const { to, customerName, companyName, reviewUrl } = params;

  const safeCompany = escapeHtml(companyName);
  const safeCustomer = escapeHtml(customerName);

  const subject = `How was your experience with ${companyName}?`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1e40af; padding:30px 40px;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">${safeCompany}</h1>
              <p style="margin:4px 0 0; color:#93c5fd; font-size:14px;">We'd love your feedback</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#111827; font-size:16px; line-height:1.6;">
                Hi ${safeCustomer},
              </p>
              <p style="margin:0 0 20px; color:#374151; font-size:14px; line-height:1.6;">
                Thank you for choosing ${safeCompany}! We hope you're happy with the work. Would you take a moment to leave us a review?
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${reviewUrl}" style="display:inline-block; background-color:#1e40af; color:#ffffff; font-size:16px; font-weight:600; padding:14px 32px; border-radius:8px; text-decoration:none;">Leave a Review</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0; color:#9ca3af; font-size:12px; line-height:1.6;">
                It only takes 30 seconds. Your feedback helps us improve and helps other customers find quality work.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb; padding:20px 40px; border-top:1px solid #e5e7eb;">
              <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center;">
                Sent via ContractorCalc
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (!resend) {
    console.log("═══ REVIEW REQUEST EMAIL (dev mode) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Review URL: ${reviewUrl}`);
    console.log("════════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error("Review request email error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send weekly profit & loss summary to contractor.
 */
interface WeeklyPnLParams {
  to: string;
  companyName: string;
  weekStart: string;
  weekEnd: string;
  revenueWon: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  jobsCompleted: number;
  quotesSent: number;
  quotesViewed: number;
  topDeals: Array<{ customerName: string; amount: number }>;
}

export async function sendWeeklyPnLEmail(params: WeeklyPnLParams): Promise<{ success: boolean; error?: string }> {
  const {
    to, companyName, weekStart, weekEnd, revenueWon, totalCosts, profit,
    profitMargin, jobsCompleted, quotesSent, quotesViewed, topDeals,
  } = params;

  const safeCompany = escapeHtml(companyName);
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const isProfit = profit >= 0;
  const profitColor = isProfit ? "#16a34a" : "#dc2626";

  const subject = `Weekly Business Report — ${weekStart} to ${weekEnd}`;

  const topDealsHtml = topDeals.length > 0
    ? topDeals.map((d) => `<tr><td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${escapeHtml(d.customerName)}</td><td style="padding:6px 0;color:#60a5fa;font-size:14px;text-align:right;font-weight:600;">$${fmt(d.amount)}</td></tr>`).join("")
    : `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;" colspan="2">No deals closed this week</td></tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:8px;overflow:hidden;">
        <tr><td style="background-color:#1e293b;padding:30px 40px;border-bottom:1px solid #334155;">
          <h1 style="margin:0;color:#3b82f6;font-size:20px;font-weight:700;">ContractorCalc</h1>
          <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">${weekStart} &mdash; ${weekEnd}</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 24px;color:#f1f5f9;font-size:18px;font-weight:600;">Weekly Business Report</p>

          <!-- Key metrics grid -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr>
              <td width="33%" style="padding:12px;background-color:#172554;border-radius:8px 0 0 8px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Revenue Won</p>
                <p style="margin:4px 0 0;color:#60a5fa;font-size:22px;font-weight:700;">$${fmt(revenueWon)}</p>
              </td>
              <td width="33%" style="padding:12px;background-color:#172554;text-align:center;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Costs</p>
                <p style="margin:4px 0 0;color:#f87171;font-size:22px;font-weight:700;">$${fmt(totalCosts)}</p>
              </td>
              <td width="33%" style="padding:12px;background-color:#172554;border-radius:0 8px 8px 0;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Profit</p>
                <p style="margin:4px 0 0;color:${profitColor};font-size:22px;font-weight:700;">${isProfit ? "+" : ""}$${fmt(profit)}</p>
                <p style="margin:2px 0 0;color:${profitColor};font-size:12px;">${profitMargin}% margin</p>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr>
              <td width="33%" style="padding:12px;background-color:#0f172a;border-radius:8px 0 0 8px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Jobs Done</p>
                <p style="margin:4px 0 0;color:#f1f5f9;font-size:20px;font-weight:700;">${jobsCompleted}</p>
              </td>
              <td width="33%" style="padding:12px;background-color:#0f172a;text-align:center;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Quotes Sent</p>
                <p style="margin:4px 0 0;color:#f1f5f9;font-size:20px;font-weight:700;">${quotesSent}</p>
              </td>
              <td width="33%" style="padding:12px;background-color:#0f172a;border-radius:0 8px 8px 0;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;">Quotes Viewed</p>
                <p style="margin:4px 0 0;color:#f1f5f9;font-size:20px;font-weight:700;">${quotesViewed}</p>
              </td>
            </tr>
          </table>

          <!-- Top deals -->
          <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Top Deals This Week</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #334155;">
            ${topDealsHtml}
          </table>
        </td></tr>
        <tr><td style="background-color:#020617;padding:20px 40px;border-top:1px solid #334155;">
          <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;">ContractorCalc &mdash; Professional quotes in 30 seconds</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  if (!resend) {
    console.log("═══ WEEKLY P&L EMAIL (dev mode) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Revenue: $${fmt(revenueWon)} | Costs: $${fmt(totalCosts)} | Profit: $${fmt(profit)} (${profitMargin}%)`);
    console.log("════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error("Weekly P&L email error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send follow-up reminder email to contractor.
 */
interface FollowUpReminderParams {
  to: string;
  companyName: string;
  customerName: string;
  quoteNumber: string;
  total: number;
  message: string | null;
}

export async function sendFollowUpReminder(params: FollowUpReminderParams): Promise<{ success: boolean; error?: string }> {
  const { to, companyName, customerName, quoteNumber, total, message } = params;

  const safeCompany = escapeHtml(companyName);
  const safeCustomer = escapeHtml(customerName);
  const safeQuoteNum = escapeHtml(quoteNumber);
  const safeMessage = message ? escapeHtml(message) : null;
  const totalFormatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const subject = `Reminder: Follow up on Quote ${quoteNumber} for ${customerName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background-color:#1e293b; padding:30px 40px; border-bottom:1px solid #334155;">
              <h1 style="margin:0; color:#3b82f6; font-size:20px; font-weight:700;">ContractorCalc</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#f1f5f9; font-size:16px; line-height:1.6;">
                Hi ${safeCompany},
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#172554; border:1px solid #1e40af; border-radius:8px; margin:0 0 24px;">
                <tr>
                  <td style="padding:20px; text-align:center;">
                    <p style="margin:0 0 4px; color:#fbbf24; font-size:24px; font-weight:700;">Follow Up</p>
                    <p style="margin:0; color:#94a3b8; font-size:14px;">
                      Quote ${safeQuoteNum} for ${safeCustomer} &mdash; $${totalFormatted}
                    </p>
                  </td>
                </tr>
              </table>
              ${safeMessage ? `<p style="margin:0 0 16px; color:#f1f5f9; font-size:14px; line-height:1.6;"><strong>Note:</strong> ${safeMessage}</p>` : ""}
              <p style="margin:0; color:#9ca3af; font-size:14px; line-height:1.6;">
                You set a reminder to follow up on this quote. Check in with ${safeCustomer} to see if they have any questions.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#020617; padding:20px 40px; border-top:1px solid #334155;">
              <p style="margin:0; color:#6b7280; font-size:12px; text-align:center;">
                ContractorCalc &mdash; Professional quotes in 30 seconds
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (!resend) {
    console.log("═══ FOLLOW-UP REMINDER (dev mode) ═══");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log("══════════════════════════════════════");
    return { success: true };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error("Follow-up reminder email error:", err);
    return { success: false, error: String(err) };
  }
}
