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
<body style="margin:0; padding:0; background-color:#1a1d23; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1d23; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#22262e; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#22262e; padding:30px 40px; border-bottom:1px solid #333842;">
              <h1 style="margin:0; color:#f59e0b; font-size:20px; font-weight:700;">ContractorCalc</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px; color:#e8e6e3; font-size:16px; line-height:1.6;">
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
            <td style="background-color:#15171c; padding:20px 40px; border-top:1px solid #333842;">
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
