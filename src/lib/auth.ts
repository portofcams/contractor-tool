import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Try contractor login first
        const contractor = await prisma.contractor.findUnique({
          where: { email: credentials.email },
        });

        if (contractor?.passwordHash) {
          const match = await bcrypt.compare(credentials.password, contractor.passwordHash);
          if (match) {
            return {
              id: contractor.id,
              email: contractor.email,
              name: contractor.companyName,
              role: contractor.role || "manager",
            };
          }
        }

        // Try team member login
        const teamMember = await prisma.teamMember.findFirst({
          where: { email: credentials.email, status: "active" },
          include: { contractor: { select: { id: true, companyName: true } } },
        });

        if (teamMember?.passwordHash) {
          const match = await bcrypt.compare(credentials.password, teamMember.passwordHash);
          if (match) {
            return {
              id: teamMember.contractorId, // use contractor's ID for data access
              email: teamMember.email,
              name: teamMember.name || teamMember.contractor.companyName,
              role: teamMember.role, // "lead", "manager", or "owner"
              teamMemberId: teamMember.id,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.contractor.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.contractor.create({
            data: {
              email: user.email,
              companyName: user.name || "My Company",
              trade: "flooring",
              googleId: account.providerAccountId,
            },
          });
        } else if (!existing.googleId) {
          await prisma.contractor.update({
            where: { email: user.email },
            data: { googleId: account.providerAccountId },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const contractor = await prisma.contractor.findUnique({
            where: { email: user.email! },
          });
          if (contractor) {
            token.id = contractor.id;
            token.role = contractor.role || "manager";
          }
        } else {
          token.id = user.id;
          token.role = (user as any).role || "manager";
          if ((user as any).teamMemberId) {
            token.teamMemberId = (user as any).teamMemberId;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "manager";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
