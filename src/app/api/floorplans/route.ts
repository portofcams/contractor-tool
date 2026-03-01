import { NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  try {
    const contractor = await getContractor();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const where: Record<string, unknown> = {};
    if (customerId) {
      // Verify customer belongs to contractor
      const customer = await prisma.customer.findFirst({
        where: { id: customerId, contractorId: contractor.id },
      });
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      where.customerId = customerId;
    } else {
      // Get all floor plans for this contractor's customers
      where.customer = { contractorId: contractor.id };
    }

    const floorPlans = await prisma.floorPlan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    });

    return NextResponse.json(floorPlans);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const contractor = await getContractor();
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const customerId = formData.get("customerId") as string | null;

    if (!file || !customerId) {
      return NextResponse.json(
        { error: "File and customerId are required" },
        { status: 400 }
      );
    }

    // Verify customer belongs to contractor
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, contractorId: contractor.id },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and PDF files are allowed" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 10MB" },
        { status: 400 }
      );
    }

    // Save file with safe extension
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
    };
    const ext = extMap[file.type] || "bin";
    const fileName = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const fileUrl = `/uploads/${fileName}`;
    const fileType = file.type === "application/pdf" ? "pdf" : "image";

    const floorPlan = await prisma.floorPlan.create({
      data: {
        customerId,
        fileUrl,
        fileType,
      },
    });

    return NextResponse.json(floorPlan, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
