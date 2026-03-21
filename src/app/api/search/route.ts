import { NextRequest, NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const contractor = await getContractor();
    const q = req.nextUrl.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ customers: [], quotes: [], templates: [] });
    }

    const search = q.slice(0, 100); // Limit length

    const [customers, quotes, templates] = await Promise.all([
      prisma.customer.findMany({
        where: {
          contractorId: contractor.id,
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true },
        take: 5,
      }),
      prisma.quote.findMany({
        where: {
          contractorId: contractor.id,
          OR: [
            { quoteNumber: { contains: search, mode: "insensitive" } },
            { customer: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true,
          quoteNumber: true,
          total: true,
          status: true,
          customer: { select: { name: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quoteTemplate.findMany({
        where: {
          contractorId: contractor.id,
          name: { contains: search, mode: "insensitive" },
        },
        select: { id: true, name: true, trade: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({ customers, quotes, templates });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
