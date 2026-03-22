import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canManageTeam } from "@/lib/permissions";
import bcrypt from "bcryptjs";
import { z } from "zod";

const teamMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8).optional(),
  role: z.enum(["owner", "manager", "lead"]).default("lead"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.teamMember.findMany({
    where: { contractorId: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageTeam(session.user.role || "manager")) {
    return NextResponse.json({ error: "Only owners can manage team members" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = teamMemberSchema.parse(body);

    // Check for existing
    const existing = await prisma.teamMember.findFirst({
      where: { email: data.email, contractorId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Team member with this email already exists" }, { status: 409 });
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : null;

    const member = await prisma.teamMember.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        passwordHash,
        status: passwordHash ? "active" : "invited",
        contractorId: session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Invalid input: ${error.issues[0].message}` },
        { status: 400 }
      );
    }
    console.error("Team member error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
