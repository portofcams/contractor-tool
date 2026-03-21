/**
 * POST /api/quotes/compare
 *
 * Accepts a photo of a competitor's quote.
 * Uses Claude Vision to extract line items for side-by-side comparison.
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
      { error: "Quote comparison requires ANTHROPIC_API_KEY" },
      { status: 503 }
    );
  }

  let body: { image: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { image } = body;
  if (!image) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" =
    "image/jpeg";
  let base64Data = image;

  if (image.startsWith("data:")) {
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mediaType = match[1] as typeof mediaType;
      base64Data = match[2];
    }
  }

  const systemPrompt = `You are an expert at reading contractor quotes, estimates, and invoices. Extract all line items from the image.

The image may be:
- A printed PDF quote
- A handwritten estimate
- A text message or email screenshot
- A photo of a paper quote

Return valid JSON matching this exact structure:
{
  "companyName": "string or null if not visible",
  "quoteDate": "string or null",
  "items": [
    {
      "description": "string",
      "quantity": number or null,
      "unit": "string or null",
      "unitPrice": number or null,
      "total": number
    }
  ],
  "subtotal": number or null,
  "tax": number or null,
  "total": number,
  "notes": "any additional info visible on the quote"
}

Rules:
- Extract every line item you can read
- If quantity or unit price aren't shown, estimate from total and description
- Convert all prices to numbers (remove $ signs, commas)
- Include labor charges as separate line items
- If handwritten and hard to read, do your best and note uncertainty`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Extract all line items and pricing from this contractor quote.",
            },
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
        { error: "Could not parse AI response", raw: textBlock.text },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Quote compare error:", err);
    return NextResponse.json(
      { error: "Quote comparison failed. Please try again." },
      { status: 500 }
    );
  }
}
