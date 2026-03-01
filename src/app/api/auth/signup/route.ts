import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 5 });

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(1, "Company name is required"),
  trade: z.enum(["flooring", "painting", "drywall"]),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const limited = limiter.check(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    const existing = await prisma.contractor.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const contractor = await prisma.contractor.create({
      data: {
        email: data.email,
        passwordHash,
        companyName: data.companyName,
        trade: data.trade,
        phone: data.phone || null,
      },
    });

    return NextResponse.json(
      { id: contractor.id, email: contractor.email },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
