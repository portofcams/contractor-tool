/**
 * DELETE /api/settings/account
 *
 * Permanently deletes the contractor's account and all associated data.
 * Requires the user's password for confirmation.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json(
      { error: "Password is required to delete your account" },
      { status: 400 }
    );
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });

  if (!contractor) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, contractor.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // Delete all related data in order (respecting FK constraints)
  await prisma.$transaction([
    prisma.floorPlan.deleteMany({
      where: { customer: { contractorId: contractor.id } },
    }),
    prisma.quote.deleteMany({ where: { contractorId: contractor.id } }),
    prisma.quoteTemplate.deleteMany({ where: { contractorId: contractor.id } }),
    prisma.customer.deleteMany({ where: { contractorId: contractor.id } }),
    prisma.materialCost.deleteMany({ where: { contractorId: contractor.id } }),
    prisma.contractor.delete({ where: { id: contractor.id } }),
  ]);

  return NextResponse.json({ success: true });
}
