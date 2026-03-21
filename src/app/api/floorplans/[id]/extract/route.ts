import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { readFile } from "@/lib/storage";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

interface ExtractedRoom {
  name: string;
  length: number;
  width: number;
  height: number;
  sqft: number;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractor = await getContractor();

    const floorPlan = await prisma.floorPlan.findFirst({
      where: {
        id,
        customer: { contractorId: contractor.id },
      },
    });

    if (!floorPlan) {
      return NextResponse.json({ error: "Floor plan not found" }, { status: 404 });
    }

    if (floorPlan.fileType === "pdf") {
      return NextResponse.json(
        { error: "PDF extraction not supported yet. Please upload an image (JPEG, PNG, WebP)." },
        { status: 400 }
      );
    }

    // Read the file from storage (R2 or local)
    const fileBuffer = await readFile(floorPlan.fileUrl);
    const base64 = fileBuffer.toString("base64");

    // Determine media type
    const ext = floorPlan.fileUrl.split(".").pop()?.toLowerCase();
    const mediaTypeMap: Record<string, "image/jpeg" | "image/png" | "image/webp" | "image/gif"> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mediaType = mediaTypeMap[ext || ""] || "image/jpeg";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `Analyze this floor plan image and extract room dimensions.

For each room you can identify, provide:
- name: The room label (e.g., "Living Room", "Bedroom 1", "Kitchen")
- length: Length in feet (estimate from scale if shown, or from typical residential proportions)
- width: Width in feet
- height: Ceiling height in feet (default 8 if not shown)
- sqft: Square footage (length × width)

Return ONLY valid JSON in this exact format, no other text:
{
  "rooms": [
    { "name": "Living Room", "length": 15, "width": 12, "height": 8, "sqft": 180 },
    { "name": "Kitchen", "length": 10, "width": 10, "height": 8, "sqft": 100 }
  ],
  "totalSqft": 280,
  "notes": "Brief note about scale/confidence"
}

If you cannot identify any rooms, return: { "rooms": [], "totalSqft": 0, "notes": "reason" }`,
            },
          ],
        },
      ],
    });

    // Parse AI response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let parsed: { rooms: ExtractedRoom[]; totalSqft: number; notes: string };
    try {
      // Extract JSON from response (may have markdown code fences)
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Could not parse AI response. Try a clearer floor plan image." },
        { status: 422 }
      );
    }

    // Validate and sanitize
    const rooms = (parsed.rooms || []).slice(0, 20).map((r) => ({
      name: String(r.name || "Room").slice(0, 50),
      length: Math.max(0, Math.min(Number(r.length) || 0, 200)),
      width: Math.max(0, Math.min(Number(r.width) || 0, 200)),
      height: Math.max(0, Math.min(Number(r.height) || 8, 30)),
      sqft: Math.max(0, Math.min(Number(r.sqft) || 0, 10000)),
    }));

    const totalSqft = rooms.reduce((sum, r) => sum + r.sqft, 0);

    // Update floor plan record with extracted data
    await prisma.floorPlan.update({
      where: { id },
      data: {
        roomsData: rooms,
        totalSquareFeet: totalSqft,
      },
    });

    return NextResponse.json({
      rooms,
      totalSqft,
      notes: parsed.notes || "",
    });
  } catch (err) {
    console.error("Floor plan extraction error:", err);
    return NextResponse.json(
      { error: "Failed to analyze floor plan. Please try again." },
      { status: 500 }
    );
  }
}
