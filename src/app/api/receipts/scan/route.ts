/**
 * POST /api/receipts/scan — Scan a receipt photo and extract line items via Claude Vision
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!anthropic) {
    return NextResponse.json(
      { error: "Receipt scanning requires ANTHROPIC_API_KEY" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { image } = body;

  if (!image) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg";
  let base64Data = image;

  if (image.startsWith("data:")) {
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mediaType = match[1] as typeof mediaType;
      base64Data = match[2];
    }
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `You are an expert at reading receipts. Extract all line items from this receipt photo.

Return valid JSON:
{
  "store": "string",
  "date": "YYYY-MM-DD or null",
  "items": [{"description": "string", "amount": number, "category": "materials"|"labor"|"other"}],
  "subtotal": number,
  "tax": number,
  "total": number
}

Rules:
- Categorize construction/trade items as "materials", labor charges as "labor", everything else as "other"
- If a value is unclear, use your best estimate
- Amounts should be numbers (not strings)`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Data },
            },
            { type: "text", text: "Extract all line items from this receipt." },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse receipt", raw: textBlock.text },
        { status: 500 }
      );
    }

    const receipt = JSON.parse(jsonMatch[0]);
    return NextResponse.json(receipt);
  } catch (err) {
    console.error("Receipt scan error:", err);
    return NextResponse.json(
      { error: "Receipt scanning failed. Please try again." },
      { status: 500 }
    );
  }
}
