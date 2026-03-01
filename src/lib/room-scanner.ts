/**
 * Room Scanner — TypeScript interface for the native LiDAR plugin.
 *
 * Uses Apple's RoomPlan API via a custom Capacitor plugin.
 * Falls back gracefully on non-LiDAR devices and web.
 *
 * Usage:
 *   import { roomScanner } from "@/lib/room-scanner";
 *   if (await roomScanner.isAvailable()) {
 *     const result = await roomScanner.scan();
 *     // result.rooms -> [{ name, length, width, height, floorArea, wallArea }]
 *   }
 */

import { Capacitor, registerPlugin } from "@capacitor/core";

// ── Types ──

export interface ScannedRoom {
  name: string;
  length: number; // feet
  width: number; // feet
  height: number; // feet
  floorArea: number; // sqft
  wallArea: number; // sqft
}

export interface ScanResult {
  rooms: ScannedRoom[];
  surfaceCount: number;
  wallCount: number;
  floorCount: number;
  doorCount: number;
  windowCount: number;
  openingCount: number;
}

interface RoomScannerPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  startScan(): Promise<ScanResult>;
}

// ── Register Plugin ──

const RoomScannerNative = registerPlugin<RoomScannerPlugin>("RoomScanner");

// ── Public API ──

export const roomScanner = {
  /**
   * Check if LiDAR scanning is available on this device.
   * Returns false on web, Android, and non-LiDAR iOS devices.
   */
  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    if (Capacitor.getPlatform() !== "ios") return false;

    try {
      const result = await RoomScannerNative.isAvailable();
      return result.available;
    } catch {
      return false;
    }
  },

  /**
   * Start a LiDAR room scan. Presents the RoomCaptureView full-screen.
   * Returns scanned room dimensions when the user taps "Done".
   * Throws if cancelled or unavailable.
   */
  async scan(): Promise<ScanResult> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("LiDAR scanning requires the native iOS app");
    }

    return RoomScannerNative.startScan();
  },
};
