import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, phone, email, role, hourlyRate } = body as {
    name?: string; phone?: string; email?: string; role?: string; hourlyRate?: number;
  };

  if (!name || typeof name !== "string") return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (name.length > 200) return NextResponse.json({ error: "Name too long" }, { status: 400 });
  if (phone && typeof phone === "string" && phone.length > 30) return NextResponse.json({ error: "Phone too long" }, { status: 400 });
  if (email && typeof email === "string" && email.length > 254) return NextResponse.json({ error: "Email too long" }, { status: 400 });
  if (role && typeof role === "string" && role.length > 100) return NextResponse.json({ error: "Role too long" }, { status: 400 });
  if (hourlyRate !== undefined && (typeof hourlyRate !== "number" || hourlyRate < 0 || hourlyRate > 10000)) return NextResponse.json({ error: "Invalid hourly rate" }, { status: 400 });

  try {
    const member = await prisma.crewMember.create({
      data: {
        contractorId: session.user.id,
        name,
        phone: phone || null,
        email: email || null,
        role: role || null,
        hourlyRate: hourlyRate || null,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add crew member" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") !== "false";

  const members = await prisma.crewMember.findMany({
    where: { contractorId: session.user.id, ...(activeOnly ? { active: true } : {}) },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(members);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id, ...updates } = body as { id?: string; [key: string]: unknown };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const existing = await prisma.crewMember.findFirst({ where: { id, contractorId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof updates.name === "string") data.name = updates.name;
  if (typeof updates.phone === "string" || updates.phone === null) data.phone = updates.phone;
  if (typeof updates.email === "string" || updates.email === null) data.email = updates.email;
  if (typeof updates.role === "string" || updates.role === null) data.role = updates.role;
  if (typeof updates.hourlyRate === "number" || updates.hourlyRate === null) data.hourlyRate = updates.hourlyRate;
  if (typeof updates.active === "boolean") data.active = updates.active;

  const updated = await prisma.crewMember.update({ where: { id }, data });
  return NextResponse.json(updated);
}
