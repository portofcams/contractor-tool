/**
 * PUT /api/settings
 *
 * Updates the contractor's company profile settings.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { companyName, phone, trade, defaultMarkup } = body;

  if (!companyName || !trade) {
    return NextResponse.json(
      { error: "Company name and trade are required" },
      { status: 400 }
    );
  }

  if (!["flooring", "painting", "drywall"].includes(trade)) {
    return NextResponse.json({ error: "Invalid trade" }, { status: 400 });
  }

  const markup = typeof defaultMarkup === "number" ? Math.max(0, Math.min(500, defaultMarkup)) : 50;

  await prisma.contractor.update({
    where: { id: session.user.id },
    data: {
      companyName,
      phone: phone || null,
      trade,
      defaultMarkup: markup,
    },
  });

  return NextResponse.json({ success: true });
}
