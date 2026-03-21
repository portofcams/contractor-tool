import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(50),
  materialType: z.string().min(1).max(100),
  itemType: z.enum(["material", "labor", "misc"]),
  unit: z.string().min(1).max(20),
  costPerUnit: z.number().min(0),
  wasteFactor: z.number().min(0).max(1).default(0),
  defaultQty: z.number().min(0).optional(),
  sortOrder: z.number().int().default(0),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const itemType = searchParams.get("itemType");

  const items = await prisma.materialCost.findMany({
    where: {
      contractorId: session.user.id,
      active: true,
      ...(category ? { category } : {}),
      ...(itemType ? { itemType } : {}),
    },
    orderBy: [{ category: "asc" }, { itemType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const item = await prisma.materialCost.create({
      data: {
        contractorId: session.user.id,
        category: data.category,
        materialType: data.materialType,
        name: data.name,
        itemType: data.itemType,
        unit: data.unit,
        costPerUnit: data.costPerUnit,
        wasteFactor: data.wasteFactor,
        defaultQty: data.defaultQty ?? null,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Price book create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
