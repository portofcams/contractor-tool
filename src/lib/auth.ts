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

        const contractor = await prisma.contractor.findUnique({
          where: { email: credentials.email },
        });

        if (!contractor || !contractor.passwordHash) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          contractor.passwordHash
        );

        if (!passwordMatch) return null;

        return {
          id: contractor.id,
          email: contractor.email,
          name: contractor.companyName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // Create contractor record for first-time Google sign-ins
        const existing = await prisma.contractor.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.contractor.create({
            data: {
              email: user.email,
              companyName: user.name || "My Company",
              trade: "flooring", // default trade, user can change in settings
              googleId: account.providerAccountId,
            },
          });
        } else if (!existing.googleId) {
          // Link Google account to existing email-based account
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
          // Google users: look up contractor by email to get the UUID
          const contractor = await prisma.contractor.findUnique({
            where: { email: user.email! },
          });
          if (contractor) {
            token.id = contractor.id;
          }
        } else {
          // Credentials users: user.id is already the contractor UUID
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
