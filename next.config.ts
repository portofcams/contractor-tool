import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Next.js Configuration — ProBuildCalc
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
  // Per maintainer preference, type-check debt must not block a production
  // deploy (deploys were chronically broken by gating). `tsc --noEmit` still
  // runs as an advisory step in CI to surface issues. See deploy.yml.
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Note: Next 16 removed `next lint` and the build-time ESLint pass, so the
// pre-existing react-hooks / no-explicit-any errors do NOT break `next build`.
// Lint is surfaced as an advisory (non-blocking) step in CI; type safety is
// enforced via `tsc --noEmit`. See .github/workflows/deploy.yml.

// Sentry / GlitchTip error monitoring. Dormant unless NEXT_PUBLIC_SENTRY_DSN is
// set in the environment (see sentry.*.config.ts -> `enabled`). Source-map
// upload only runs when SENTRY_AUTH_TOKEN is present.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "ikena-group",
  project: process.env.SENTRY_PROJECT || "probuildcalc",
  sentryUrl: process.env.SENTRY_URL || "https://errors.portofcams.com",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  disableLogger: true,
  sourcemaps: process.env.SENTRY_AUTH_TOKEN ? undefined : { disable: true },
});
