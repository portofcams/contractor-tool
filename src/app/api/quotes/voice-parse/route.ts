/**
 * POST /api/quotes/voice-parse
 *
 * Accepts a transcript from speech recognition and trade type.
 * Uses Claude to parse natural language into structured rooms + materials.
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
      { error: "Voice parsing requires ANTHROPIC_API_KEY to be configured" },
      { status: 503 }
    );
  }

  let body: { transcript: string; trade: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { transcript, trade } = body;
  if (!transcript || !trade) {
    return NextResponse.json(
      { error: "transcript and trade are required" },
      { status: 400 }
    );
  }

  const tradeContext: Record<string, string> = {
    flooring: `Flooring materials: hardwood ($5-8/sqft), laminate ($2-4/sqft), vinyl plank ($3-5/sqft), tile ($4-7/sqft), carpet ($2-4/sqft).
Also include: underlayment ($0.50-1.00/sqft), baseboards ($1.50-3.00/linear ft), transition strips ($3-8 each), removal of old flooring if mentioned.
Calculate: perimeter for baseboards, floor area + 10% waste for flooring.`,

    painting: `Painting materials: interior paint ($35-55/gallon, covers ~350 sqft/coat), primer ($25-40/gallon), exterior paint ($40-60/gallon).
Also include: tape/supplies ($15-30/room), caulk ($5-8/tube), drop cloths.
Calculate: wall area = perimeter × height - windows/doors, ceiling area = length × width. Default 2 coats.`,

    drywall: `Drywall materials: 4x8 sheet ($12-18), 4x12 sheet ($15-22), joint compound 5-gal ($15-20), tape 500ft ($8-12).
Also include: corner beads ($3-5 each), screws ($8-12/lb), sandpaper.
Calculate: wall/ceiling area, divide by sheet size (32 sqft for 4x8, 48 sqft for 4x12), add 10% waste.`,
  };

  const systemPrompt = `You are an expert contractor estimator. Parse spoken notes from a contractor into structured room dimensions and material estimates.

The contractor is dictating while walking through a jobsite. Their speech may include:
- Room names and dimensions ("living room is 15 by 20", "bedroom about 12 by 14")
- Material preferences ("oak hardwood", "two coats of eggshell")
- Special notes ("needs subfloor repair", "high ceilings about 10 feet")
- Mixed formats ("fifteen by twenty", "15 by 20", "about 300 square feet")

Trade: ${trade}
${tradeContext[trade] || tradeContext.flooring}

Return valid JSON matching this exact structure:
{
  "rooms": [{"name": "string", "lengthFt": number, "widthFt": number, "heightFt": number, "sqft": number}],
  "materials": [{"item": "string", "qty": number, "unit": "string", "unitCost": number, "cost": number}],
  "notes": "string with any assumptions or caveats",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Convert spoken numbers to digits ("fifteen" → 15)
- If only sqft is given, estimate reasonable length × width
- Default ceiling height to 8ft unless stated otherwise
- Always include waste factors
- "cost" = qty × unitCost
- confidence: "high" if clear dimensions given, "medium" if some assumptions, "low" if vague`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Parse this contractor's spoken notes into a structured quote:\n\n"${transcript}"`,
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
    console.error("Voice parse error:", err);
    return NextResponse.json(
      { error: "Voice parsing failed. Please try again." },
      { status: 500 }
    );
  }
}
