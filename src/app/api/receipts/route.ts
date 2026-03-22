import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const receiptSchema = z.object({
  jobId: z.string().uuid().optional(),
  imageUrl: z.string().optional(),
  store: z.string().max(200).optional(),
  receiptDate: z.string().optional(), // ISO date
  items: z.array(z.object({
    description: z.string(),
    amount: z.number(),
    category: z.string().default("materials"),
  })).optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number(),
  category: z.enum(["materials", "labor", "other"]).default("materials"),
  notes: z.string().max(1000).optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  const where: any = { contractorId: session.user.id };
  if (jobId) where.jobId = jobId;

  const receipts = await prisma.receipt.findMany({
    where,
    include: {
      job: { select: { id: true, quote: { select: { projectName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(receipts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = receiptSchema.parse(body);

    const receipt = await prisma.receipt.create({
      data: {
        contractorId: session.user.id,
        jobId: data.jobId || null,
        imageUrl: data.imageUrl || null,
        store: data.store || null,
        receiptDate: data.receiptDate ? new Date(data.receiptDate) : null,
        items: data.items ? JSON.parse(JSON.stringify(data.items)) : undefined,
        subtotal: data.subtotal ?? null,
        tax: data.tax ?? null,
        total: data.total,
        category: data.category,
        notes: data.notes || null,
      },
    });

    // Also create an ActualCost entry if linked to a job
    if (data.jobId) {
      await prisma.actualCost.create({
        data: {
          contractorId: session.user.id,
          jobId: data.jobId,
          description: data.store ? `Receipt: ${data.store}` : "Receipt expense",
          amount: data.total,
          category: data.category,
          receiptUrl: data.imageUrl || null,
        },
      });
    }

    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Invalid input: ${error.issues[0].message}` },
        { status: 400 }
      );
    }
    console.error("Receipt error:", error);
    return NextResponse.json({ error: "Failed to save receipt" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await prisma.receipt.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.receipt.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
