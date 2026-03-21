"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

/**
 * 3D Render mode — displays the USDZ model from the LiDAR scan
 * using Google's model-viewer web component. Supports AR on iOS.
 */
export function RenderMode({ scan }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Build a data URL from the base64 USDZ
  const modelSrc = scan.usdzBase64
    ? `data:model/vnd.usdz+zip;base64,${scan.usdzBase64}`
    : null;

  if (!modelSrc) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <h3 className="font-medium mb-1">No 3D Model Available</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The USDZ model wasn&apos;t captured in this scan. Try scanning again — make sure to scan all walls and the floor completely.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">3D Room Model</CardTitle>
            <div className="flex gap-2">
              {scan.usdzBase64 && (
                <a
                  href={modelSrc}
                  download="room-scan.usdz"
                >
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Download USDZ
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl overflow-hidden bg-secondary/30" style={{ height: 450 }}>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center space-y-2">
                  <svg className="w-8 h-8 animate-spin mx-auto text-primary" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  <p className="text-xs text-muted-foreground">Loading 3D model...</p>
                </div>
              </div>
            )}

            {/* @ts-expect-error model-viewer is a web component */}
            <model-viewer
              src={modelSrc}
              ios-src={modelSrc}
              alt="3D room scan"
              ar
              ar-modes="scene-viewer webxr quick-look"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              shadow-intensity="1"
              environment-image="neutral"
              style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
              onLoad={() => setLoaded(true)}
            >
              <button
                slot="ar-button"
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  padding: "10px 20px",
                  backgroundColor: "var(--primary, #0071e3)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View in AR
              </button>
            {/* @ts-expect-error model-viewer is a web component */}
            </model-viewer>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>Drag to rotate · Pinch to zoom · Two-finger drag to pan</span>
            <span>On iPhone: tap &quot;View in AR&quot; to place in your space</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
