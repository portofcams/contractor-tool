import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, company } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message required" }, { status: 400 });
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn("[contact] GMAIL_APP_PASSWORD not set");
      return NextResponse.json({ ok: true }); // Don't error out
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "portofcams@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `ProBuildCalc <${process.env.GMAIL_USER || "portofcams@gmail.com"}>`,
      to: "portofcams@gmail.com",
      replyTo: email,
      subject: `ProBuildCalc Contact: ${name}${company ? ` (${company})` : ""}`,
      html: `
        <h3>New Contact from ProBuildCalc</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
