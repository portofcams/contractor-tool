/**
 * Capacitor App Initialization — ContractorCalc
 *
 * This file is imported once in the root layout (client-side only).
 * It bootstraps native plugins and sets up auto-sync.
 *
 * What it does:
 *   - Configures the status bar and splash screen
 *   - Registers the back button handler
 *   - Sets up auto-sync on network reconnect
 *   - Logs the app launch session
 */

import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { setupAutoSync } from "./sync-service";
import { offlineStore } from "./offline-storage";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://contractorcalc.com";

export async function initCapacitor(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  // Status bar — dark content on light background
  await StatusBar.setStyle({ style: Style.Dark });

  // Hide splash after app is ready
  await SplashScreen.hide();

  // Handle hardware back button (Android, but harmless on iOS)
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  // Log app launch
  await offlineStore.logSession({
    action: "app_launch",
    details: `Platform: ${Capacitor.getPlatform()}`,
  });

  // Start auto-sync on network changes
  setupAutoSync(API_BASE);
}
