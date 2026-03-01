/**
 * POST /api/site-photos — Upload a job site photo
 * GET  /api/site-photos — List photos (filtered by customerId/quoteId)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/** Strict map from validated MIME type to file extension */
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

/** JPEG/PNG/WebP magic byte signatures */
const SIGNATURES: { type: string; bytes: number[] }[] = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

function detectMimeFromBytes(buffer: Buffer): string | null {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) {
      return sig.type;
    }
  }
  // HEIC/HEIF files have "ftyp" at offset 4
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "heic" || brand === "heix" || brand === "mif1") return "image/heic";
    if (brand === "hevc" || brand === "hevx") return "image/heif";
  }
  return null;
}

/** Validate that customerId/quoteId belong to this contractor */
async function verifyOwnership(
  contractorId: string,
  customerId?: string | null,
  quoteId?: string | null
): Promise<string | null> {
  if (customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, contractorId },
    });
    if (!customer) return "Customer not found";
  }
  if (quoteId) {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, contractorId },
    });
    if (!quote) return "Quote not found";
  }
  return null;
}

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

  // Validate declared MIME type against allowlist
  const ext = EXT_MAP[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or HEIC." }, { status: 400 });
  }

  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  // Caption length limit
  if (caption && caption.length > 500) {
    return NextResponse.json({ error: "Caption too long (max 500 chars)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Verify actual file content matches declared type (magic bytes)
  const detectedType = detectMimeFromBytes(buffer);
  if (!detectedType || !EXT_MAP[detectedType]) {
    return NextResponse.json({ error: "File content does not match an allowed image type" }, { status: 400 });
  }

  // Use extension from detected type, not declared type
  const safeExt = EXT_MAP[detectedType];

  // IDOR: verify ownership of customerId/quoteId
  const ownershipError = await verifyOwnership(session.user.id, customerId, quoteId);
  if (ownershipError) {
    return NextResponse.json({ error: ownershipError }, { status: 404 });
  }

  const fileName = `${crypto.randomUUID()}.${safeExt}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
  const filePath = path.join(uploadDir, fileName);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/photos/${fileName}`;

  try {
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
  } catch {
    // Clean up orphaned file if DB insert fails
    await unlink(filePath).catch(() => {});
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
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

  try {
    const photos = await prisma.sitePhoto.findMany({
      where,
      orderBy: { takenAt: "desc" },
      take: 100,
    });

    return NextResponse.json(photos);
  } catch {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
