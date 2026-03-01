import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
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
  const duration = parseInt(formData.get("duration") as string) || 0;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 25MB." }, { status: 400 });
  }

  // Verify ownership
  if (customerId) {
    const c = await prisma.customer.findFirst({ where: { id: customerId, contractorId: session.user.id } });
    if (!c) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  if (quoteId) {
    const q = await prisma.quote.findFirst({ where: { id: quoteId, contractorId: session.user.id } });
    if (!q) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Magic-byte verification for audio formats
  const AUDIO_SIGS: { type: string; ext: string; check: (b: Buffer) => boolean }[] = [
    { type: "audio/webm", ext: "webm", check: (b) => b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3 },
    { type: "audio/ogg", ext: "ogg", check: (b) => b.length >= 4 && b.toString("ascii", 0, 4) === "OggS" },
    { type: "audio/wav", ext: "wav", check: (b) => b.length >= 4 && b.toString("ascii", 0, 4) === "RIFF" },
    { type: "audio/mp4", ext: "m4a", check: (b) => b.length >= 8 && b.toString("ascii", 4, 8) === "ftyp" },
    { type: "audio/mpeg", ext: "mp3", check: (b) => b.length >= 3 && ((b[0] === 0xff && (b[1] & 0xe0) === 0xe0) || b.toString("ascii", 0, 3) === "ID3") },
  ];
  const detected = AUDIO_SIGS.find((s) => s.check(buffer));
  if (!detected) {
    return NextResponse.json({ error: "File content does not match an allowed audio type" }, { status: 400 });
  }

  const ext = detected.ext;
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "voice");
  const filePath = path.join(uploadDir, fileName);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);

  try {
    const note = await prisma.voiceNote.create({
      data: {
        contractorId: session.user.id,
        customerId: customerId || null,
        quoteId: quoteId || null,
        fileUrl: `/uploads/voice/${fileName}`,
        duration,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch {
    await unlink(filePath).catch(() => {});
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
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

  const notes = await prisma.voiceNote.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(notes);
}
