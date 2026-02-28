/**
 * POST /api/settings/logo
 *
 * Uploads a company logo image and updates the contractor record.
 * Accepts JPEG, PNG, WebP, SVG up to 2MB.
 * Saves to public/uploads/logos/ and stores the URL path on Contractor.logoUrl.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and SVG files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Logo must be under 2MB" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "png";
  const fileName = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

  const logoUrl = `/uploads/logos/${fileName}`;

  await prisma.contractor.update({
    where: { id: session.user.id },
    data: { logoUrl },
  });

  return NextResponse.json({ logoUrl });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.contractor.update({
    where: { id: session.user.id },
    data: { logoUrl: null },
  });

  return NextResponse.json({ success: true });
}
