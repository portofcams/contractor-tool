"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  arMaterialPreview,
  FLOORING_MATERIALS,
  PAINT_MATERIALS,
  type ARPreviewMaterial,
} from "@/lib/ar-material-preview";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

/**
 * Material Preview mode — browse materials and preview them in AR on real surfaces.
 * Polycam doesn't have this — it's a killer feature for contractors showing clients options.
 */
export function MaterialMode({ scan }: Props) {
  const [arAvailable, setArAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"flooring" | "paint">("flooring");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  useEffect(() => {
    arMaterialPreview.isAvailable().then(setArAvailable);
  }, []);

  const materials: ARPreviewMaterial[] =
    selectedCategory === "flooring" ? FLOORING_MATERIALS : PAINT_MATERIALS;
  const mode = selectedCategory === "flooring" ? "floor" : "wall";

  async function handlePreview(material?: ARPreviewMaterial) {
    setLoading(true);
    try {
      const mats = material ? [material] : materials;
      const result = await arMaterialPreview.startPreview({
        materials: mats,
        mode: mode as "floor" | "wall",
      });
      if (result.selectedMaterial) {
        setSelectedMaterial(result.selectedMaterial);
      }
    } catch {
      // cancelled
    } finally {
      setLoading(false);
    }
  }

  // Estimate material cost from scan data
  const totalFloorArea = scan.rooms.reduce((s, r) => s + r.floorArea, 0);
  const totalWallArea = scan.rooms.reduce((s, r) => s + r.wallArea, 0);
  const relevantArea = selectedCategory === "flooring" ? totalFloorArea : totalWallArea;

  return (
    <div className="space-y-4">
      {/* Category toggle */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg w-fit">
        <button
          onClick={() => setSelectedCategory("flooring")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            selectedCategory === "flooring"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Flooring
        </button>
        <button
          onClick={() => setSelectedCategory("paint")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            selectedCategory === "paint"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Paint Colors
        </button>
      </div>

      {/* Area context */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedCategory === "flooring" ? "Floor area to cover" : "Wall area to paint"}
              </p>
              <p className="text-2xl font-bold">{Math.round(relevantArea)} sqft</p>
            </div>
            {arAvailable && (
              <Button onClick={() => handlePreview()} disabled={loading} className="gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {loading ? "Opening..." : "Preview All in AR"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Material grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {selectedCategory === "flooring" ? "Flooring Materials" : "Paint Colors"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {materials.map((mat) => (
              <button
                key={mat.name}
                onClick={() => arAvailable ? handlePreview(mat) : setSelectedMaterial(mat.name)}
                disabled={loading}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center",
                  selectedMaterial === mat.name
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                {/* Color swatch */}
                <div
                  className="w-12 h-12 rounded-lg shadow-inner border border-border/50"
                  style={{ backgroundColor: mat.color }}
                />
                <div>
                  <p className="text-xs font-medium">{mat.name}</p>
                  {arAvailable && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">Tap to preview in AR</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected material info */}
      {selectedMaterial && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg shadow-inner border border-border/50"
                style={{
                  backgroundColor: materials.find((m) => m.name === selectedMaterial)?.color || "#888",
                }}
              />
              <div>
                <p className="text-sm font-medium">{selectedMaterial}</p>
                <p className="text-xs text-muted-foreground">
                  Selected for {Math.round(relevantArea)} sqft of {selectedCategory === "flooring" ? "floor" : "wall"} area
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!arAvailable && (
        <div className="text-center text-xs text-muted-foreground py-4">
          AR material preview requires iPhone Pro or iPad Pro with ARKit.
          Material swatches are viewable on any device.
        </div>
      )}
    </div>
  );
}
