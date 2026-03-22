import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const photo = await prisma.sitePhoto.findFirst({
    where: { id, contractorId: session.user.id },
  });

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete file from storage (R2 or local)
  await deleteFile(photo.fileUrl).catch(() => {});

  // Delete DB record
  await prisma.sitePhoto.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
