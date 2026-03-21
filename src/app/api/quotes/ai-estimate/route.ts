/**
 * POST /api/quotes/ai-estimate
 *
 * Accepts a room photo (base64) and trade type.
 * Uses Claude Vision to analyze the room and generate a material estimate.
 * Returns structured material lines that can pre-fill a quote.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface AIEstimateResult {
  rooms: { name: string; lengthFt: number; widthFt: number; sqft: number }[];
  materials: MaterialLine[];
  notes: string;
  confidence: "high" | "medium" | "low";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!anthropic) {
    return NextResponse.json(
      { error: "AI estimation requires ANTHROPIC_API_KEY to be configured" },
      { status: 503 }
    );
  }

  let body: { image?: string; images?: string[]; trade: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { image, images, trade, notes } = body;
  const imageList = images || (image ? [image] : []);
  if (imageList.length === 0 || !trade) {
    return NextResponse.json({ error: "At least one image and trade are required" }, { status: 400 });
  }

  if (imageList.length > 10) {
    return NextResponse.json({ error: "Maximum 10 images per request" }, { status: 400 });
  }

  function parseImage(img: string) {
    let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg";
    let base64Data = img;
    if (img.startsWith("data:")) {
      const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        mediaType = match[1] as typeof mediaType;
        base64Data = match[2];
      }
    }
    return { mediaType, base64Data };
  }

  const tradePrompts: Record<string, string> = {
    flooring: `Analyze this room photo for a FLOORING project. Estimate:
- Room dimensions (length x width in feet)
- Total square footage
- Recommended flooring material and quantity (include 10% waste factor)
- Underlayment/padding needed
- Transition strips, baseboards if visible
- Any subfloor prep needed

Common unit costs (USD):
- Hardwood: $5-8/sqft, Laminate: $2-4/sqft, Vinyl plank: $3-5/sqft, Tile: $4-7/sqft
- Underlayment: $0.50-1.00/sqft, Baseboards: $1.50-3.00/linear ft`,

    painting: `Analyze this room photo for a PAINTING project. Estimate:
- Room dimensions and wall square footage
- Ceiling square footage
- Number of coats needed based on current wall condition
- Paint quantity (gallons) — 1 gallon covers ~350 sqft per coat
- Primer if needed
- Tape, drop cloths, supplies

Common unit costs (USD):
- Interior paint: $35-55/gallon, Premium: $55-75/gallon
- Primer: $25-40/gallon
- Tape/supplies: $15-30 per room`,

    drywall: `Analyze this room photo for a DRYWALL project. Estimate:
- Wall and ceiling dimensions
- Number of 4x8 or 4x12 sheets needed
- Joint compound and tape
- Corner beads if needed
- Screws/fasteners

Common unit costs (USD):
- 4x8 drywall sheet: $12-18, 4x12: $15-22
- Joint compound (5-gal): $15-20
- Tape (500ft roll): $8-12`,
  };

  const systemPrompt = `You are an expert contractor estimator. Analyze room photos and provide accurate material estimates for ${trade} projects.

IMPORTANT: Return your estimate as valid JSON matching this exact structure:
{
  "rooms": [{"name": "string", "lengthFt": number, "widthFt": number, "sqft": number}],
  "materials": [{"item": "string", "qty": number, "unit": "string", "unitCost": number, "cost": number}],
  "notes": "string with any observations, caveats, or recommendations",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Estimate dimensions from visual cues (doors are ~3ft wide x 6.8ft tall, outlets are ~1ft from floor)
- Always include a waste factor (10% for flooring, 5% for paint)
- Use realistic contractor pricing, not retail
- If you can't determine something, note it and use conservative estimates
- "cost" = qty * unitCost for each material line
- confidence: "high" if room is clearly visible with reference objects, "low" if photo is unclear`;

  const userPrompt = tradePrompts[trade] || tradePrompts.flooring;
  const fullPrompt = notes
    ? `${userPrompt}\n\nContractor's notes: ${notes}`
    : userPrompt;

  try {
    // Build content blocks with all images
    const contentBlocks: Anthropic.Messages.ContentBlockParam[] = imageList.map((img) => {
      const { mediaType: mt, base64Data: bd } = parseImage(img);
      return {
        type: "image" as const,
        source: { type: "base64" as const, media_type: mt, data: bd },
      };
    });
    contentBlocks.push({ type: "text", text: fullPrompt });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{ role: "user", content: contentBlocks }],
      system: systemPrompt,
    });

    // Extract the text response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Parse the JSON from the response
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response", raw: textBlock.text },
        { status: 500 }
      );
    }

    const estimate: AIEstimateResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json(estimate);
  } catch (err) {
    console.error("AI estimate error:", err);
    return NextResponse.json(
      { error: "AI estimation failed. Please try again." },
      { status: 500 }
    );
  }
}
