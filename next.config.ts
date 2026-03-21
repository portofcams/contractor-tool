import type { NextConfig } from "next";

/**
 * Next.js Configuration — ContractorCalc
 *
 * This runs as a full server-rendered Next.js app (NOT static export).
 * The Capacitor iOS app loads pages from the deployed server.
 */

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs", "zod", "stripe", "resend", "@anthropic-ai/sdk", "twilio"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
