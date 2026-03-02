import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor Configuration — ContractorCalc iOS App
 *
 * Architecture:
 *   The iOS app is a native shell that loads the web app from the server.
 *   This means the app is always current — no App Store update needed for
 *   web changes. Native plugins (camera, filesystem, offline storage)
 *   provide device capabilities the web alone can't.
 *
 * Build flow:
 *   1. `npx cap add ios`           — one-time: creates the Xcode project
 *   2. `npx cap sync ios`          — sync native plugins + config
 *   3. `npx cap open ios`          — open in Xcode, build & run
 *
 * Dev mode:
 *   CAPACITOR_DEV=true npx cap run ios
 *   → loads from http://localhost:3000 with live reload
 *
 * Production:
 *   → loads from https://contractorcalc.com (deployed on Vultr)
 *   → Offline: falls back to locally cached data via offline-storage.ts
 */

const isDev = process.env.CAPACITOR_DEV === "true";

const config: CapacitorConfig = {
  appId: "com.contractorcalc.app",
  appName: "ContractorCalc",
  webDir: "public", // Minimal fallback shell; real app loads from server

  server: {
    url: isDev
      ? "http://localhost:3000"
      : "https://contractor.portofcams.com",
    cleartext: isDev, // Allow HTTP only in dev
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e40af",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1e40af",
    },
  },

  ios: {
    scheme: "ContractorCalc",
    allowsLinkPreview: true,
    contentInset: "always",
  },
};

export default config;
