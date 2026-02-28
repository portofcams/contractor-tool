import type { NextConfig } from "next";

/**
 * Next.js Configuration — ContractorCalc
 *
 * This runs as a full server-rendered Next.js app (NOT static export).
 * The Capacitor iOS app loads pages from the deployed server.
 */

const nextConfig: NextConfig = {
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
