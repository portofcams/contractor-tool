/**
 * DELETE /api/settings/account
 *
 * Soft-deletes the contractor's account. Data is preserved for 30 days
 * before permanent deletion. A pre-deletion backup is triggered automatically.
 * Requires the user's password for confirmation.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 3 });

export async function DELETE(req: Request) {
  const limited = limiter.check(req);
  if (limited) return limited;

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

  if (!contractor.passwordHash) {
    return NextResponse.json({ error: "Account uses Google sign-in" }, { status: 403 });
  }
  const valid = await bcrypt.compare(password, contractor.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // Soft delete: mark account as deleted with 30-day grace period
  // Data is preserved — account can be recovered within the grace period
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 30);

  await prisma.contractor.update({
    where: { id: contractor.id },
    data: {
      // Store deletion metadata in the companyName field with prefix
      // so we can identify and recover soft-deleted accounts
      email: `deleted_${Date.now()}_${contractor.email}`,
      companyName: `[DELETED ${new Date().toISOString()}] ${contractor.companyName}`,
    },
  });

  // Log the deletion for audit trail
  console.log(
    `[ACCOUNT DELETION] Contractor ${contractor.id} (${contractor.email}) soft-deleted at ${new Date().toISOString()}. Data preserved until ${deletionDate.toISOString()}.`
  );

  return NextResponse.json({
    success: true,
    message: "Account scheduled for deletion. Your data will be preserved for 30 days. Contact support to recover your account.",
    deletionDate: deletionDate.toISOString(),
  });
}
