/**
 * GET /api/templates/marketplace — Browse shared templates (public list)
 * POST /api/templates/marketplace — Share a template to the marketplace
 * PATCH /api/templates/marketplace — Download/clone a shared template
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const trade = searchParams.get("trade");
  const sort = searchParams.get("sort") || "downloads";

  const templates = await prisma.sharedTemplate.findMany({
    where: trade ? { trade } : {},
    orderBy:
      sort === "newest"
        ? { createdAt: "desc" }
        : { downloads: "desc" },
    take: 50,
  });

  return NextResponse.json(templates);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });
  if (!contractor) {
    return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
  }

  const body = await req.json();
  const { templateId, description } = body;

  // Get the contractor's template
  const template = await prisma.quoteTemplate.findFirst({
    where: { id: templateId, contractorId: session.user.id },
  });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const shared = await prisma.sharedTemplate.create({
    data: {
      authorName: contractor.companyName,
      name: template.name,
      trade: template.trade,
      materials: template.materials as object,
      markupPercent: template.markupPercent,
      laborCost: template.laborCost,
      taxRate: template.taxRate,
      description: description || null,
    },
  });

  return NextResponse.json(shared, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sharedTemplateId } = body;

  const shared = await prisma.sharedTemplate.findUnique({
    where: { id: sharedTemplateId },
  });
  if (!shared) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Clone into contractor's templates
  const cloned = await prisma.quoteTemplate.create({
    data: {
      contractorId: session.user.id,
      name: `${shared.name} (Marketplace)`,
      trade: shared.trade,
      materials: shared.materials as object,
      markupPercent: shared.markupPercent,
      laborCost: shared.laborCost,
      taxRate: shared.taxRate,
    },
  });

  // Increment download count
  await prisma.sharedTemplate.update({
    where: { id: sharedTemplateId },
    data: { downloads: { increment: 1 } },
  });

  return NextResponse.json(cloned, { status: 201 });
}
