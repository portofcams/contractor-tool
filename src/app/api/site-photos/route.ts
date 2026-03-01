/**
 * POST /api/site-photos — Upload a job site photo
 * GET  /api/site-photos — List photos (filtered by customerId/quoteId)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const customerId = formData.get("customerId") as string | null;
  const quoteId = formData.get("quoteId") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or HEIC." }, { status: 400 });
  }

  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  const fileUrl = `/uploads/photos/${fileName}`;

  const photo = await prisma.sitePhoto.create({
    data: {
      contractorId: session.user.id,
      customerId: customerId || null,
      quoteId: quoteId || null,
      fileUrl,
      caption: caption || null,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  const quoteId = searchParams.get("quoteId");

  const where: Record<string, unknown> = { contractorId: session.user.id };
  if (customerId) where.customerId = customerId;
  if (quoteId) where.quoteId = quoteId;

  const photos = await prisma.sitePhoto.findMany({
    where,
    orderBy: { takenAt: "desc" },
    take: 100,
  });

  return NextResponse.json(photos);
}
