import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const quoteSchema = z.object({
  customerId: z.string().uuid(),
  trade: z.enum(["flooring", "painting", "drywall"]),
  materials: z.array(
    z.object({
      item: z.string(),
      qty: z.number(),
      unit: z.string(),
      unitCost: z.number(),
      cost: z.number(),
    })
  ),
  subtotal: z.number(),
  laborCost: z.number().optional(),
  markupPercent: z.number().default(50),
  taxRate: z.number().default(0),
  total: z.number(),
  floorPlanId: z.string().uuid().optional(),
});

function generateQuoteNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `Q${y}${m}-${rand}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quotes = await prisma.quote.findMany({
    where: { contractorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = quoteSchema.parse(body);

    // Check free tier limit
    const contractor = await prisma.contractor.findUnique({
      where: { id: session.user.id },
    });

    if (contractor?.subscriptionPlan === "free") {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await prisma.quote.count({
        where: {
          contractorId: session.user.id,
          createdAt: { gte: thisMonth },
        },
      });

      if (monthlyCount >= 5) {
        return NextResponse.json(
          { error: "Free tier limit reached (5 quotes/month). Upgrade to continue." },
          { status: 403 }
        );
      }
    }

    const quote = await prisma.quote.create({
      data: {
        contractorId: session.user.id,
        customerId: data.customerId,
        quoteNumber: generateQuoteNumber(),
        trade: data.trade,
        materials: data.materials,
        subtotal: data.subtotal,
        laborCost: data.laborCost ?? null,
        markupPercent: data.markupPercent,
        taxRate: data.taxRate,
        total: data.total,
        floorPlanId: data.floorPlanId ?? null,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Quote creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
