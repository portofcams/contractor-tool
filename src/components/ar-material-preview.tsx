"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  arMaterialPreview,
  FLOORING_MATERIALS,
  PAINT_MATERIALS,
  type ARPreviewMaterial,
} from "@/lib/ar-material-preview";

interface ARMaterialPreviewButtonProps {
  trade: string;
  onMaterialSelected?: (materialName: string) => void;
}

/**
 * AR Material Preview button — launches ARKit overlay to preview
 * flooring or paint materials on real surfaces.
 * Only renders on native iOS devices with ARKit support.
 */
export function ARMaterialPreviewButton({
  trade,
  onMaterialSelected,
}: ARMaterialPreviewButtonProps) {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    arMaterialPreview.isAvailable().then(setAvailable);
  }, []);

  if (!available) return null;

  const isFlooring = trade === "flooring";
  const isPainting = trade === "painting";

  // Only show for flooring and painting trades
  if (!isFlooring && !isPainting) return null;

  const materials: ARPreviewMaterial[] = isFlooring
    ? FLOORING_MATERIALS
    : PAINT_MATERIALS;
  const mode = isFlooring ? "floor" : "wall";

  async function handlePreview() {
    setLoading(true);
    try {
      const result = await arMaterialPreview.startPreview({
        materials,
        mode: mode as "floor" | "wall",
      });
      if (result.selectedMaterial && onMaterialSelected) {
        onMaterialSelected(result.selectedMaterial);
      }
    } catch {
      // User cancelled or error — ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePreview}
      disabled={loading}
      className="gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      {loading ? "Opening AR..." : `Preview ${isFlooring ? "Flooring" : "Paint"} in AR`}
    </Button>
  );
}
