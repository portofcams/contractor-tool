/**
 * AR Material Preview — TypeScript interface for the native ARKit plugin.
 *
 * Overlays flooring/paint textures on real surfaces using plane detection.
 * Requires ARKit-compatible iOS device (A9+ chip).
 *
 * Usage:
 *   import { arMaterialPreview } from "@/lib/ar-material-preview";
 *   if (await arMaterialPreview.isAvailable()) {
 *     const result = await arMaterialPreview.startPreview({
 *       materials: [{ name: "Oak Hardwood", color: "#8B4513" }],
 *       mode: "floor",
 *     });
 *   }
 */

import { Capacitor, registerPlugin } from "@capacitor/core";

// ── Types ──

export interface ARPreviewMaterial {
  name: string;
  color: string; // hex color e.g. "#8B4513"
  textureUrl?: string; // optional texture image URL
  scale?: number; // texture scale (default 1.0)
}

export interface ARPreviewOptions {
  materials: ARPreviewMaterial[];
  mode: "floor" | "wall";
}

export interface ARPreviewResult {
  selectedMaterial: string; // name of selected material, empty if cancelled
  dismissed: boolean;
}

interface ARMaterialPreviewPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  startPreview(options: {
    materials: ARPreviewMaterial[];
    mode: string;
  }): Promise<ARPreviewResult>;
}

// ── Register Plugin ──

const ARMaterialPreviewNative =
  registerPlugin<ARMaterialPreviewPlugin>("ARMaterialPreview");

// ── Public API ──

export const arMaterialPreview = {
  /**
   * Check if AR material preview is available on this device.
   * Returns false on web, Android, and devices without ARKit support.
   */
  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    if (Capacitor.getPlatform() !== "ios") return false;

    try {
      const result = await ARMaterialPreviewNative.isAvailable();
      return result.available;
    } catch {
      return false;
    }
  },

  /**
   * Start the AR material preview session.
   * Presents a full-screen AR view with material overlay on detected surfaces.
   * User can cycle through materials and select one.
   */
  async startPreview(options: ARPreviewOptions): Promise<ARPreviewResult> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("AR material preview requires the native iOS app");
    }

    return ARMaterialPreviewNative.startPreview({
      materials: options.materials,
      mode: options.mode,
    });
  },
};

// ── Default Material Libraries ──

export const FLOORING_MATERIALS: ARPreviewMaterial[] = [
  { name: "Oak Hardwood", color: "#8B6914" },
  { name: "Walnut Hardwood", color: "#5C4033" },
  { name: "Maple Hardwood", color: "#C4A35A" },
  { name: "Cherry Hardwood", color: "#8B2500" },
  { name: "Light Gray Tile", color: "#B0B0B0" },
  { name: "White Marble", color: "#E8E8E0" },
  { name: "Dark Slate", color: "#3D3D3D" },
  { name: "Terracotta Tile", color: "#C75B39" },
  { name: "Beige Carpet", color: "#C8B88A" },
  { name: "Gray Carpet", color: "#808080" },
];

export const PAINT_MATERIALS: ARPreviewMaterial[] = [
  { name: "Pure White", color: "#FFFFFF" },
  { name: "Warm White", color: "#FAF0E6" },
  { name: "Light Gray", color: "#D3D3D3" },
  { name: "Agreeable Gray", color: "#C8BFB0" },
  { name: "Navy Blue", color: "#1B2951" },
  { name: "Forest Green", color: "#2D4F3E" },
  { name: "Sage Green", color: "#9CAF88" },
  { name: "Dusty Rose", color: "#C4A4A0" },
  { name: "Charcoal", color: "#36454F" },
  { name: "Cream", color: "#FFFDD0" },
];
