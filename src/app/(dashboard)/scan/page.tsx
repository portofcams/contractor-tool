"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { roomScanner, type ScanResult, averageScans } from "@/lib/room-scanner";
import { ScanConfidencePanel } from "@/components/scan-confidence";
import { FloorAreaMode } from "@/components/scan-modes/floor-area";
import { WallAreaMode } from "@/components/scan-modes/wall-area";
import { BlueprintMode } from "@/components/scan-modes/blueprint-3d";
import { RenderMode } from "@/components/scan-modes/render-3d";
import { MeasureMode } from "@/components/scan-modes/point-measure";
import { ExportMode } from "@/components/scan-modes/export";
import { AROverlayMode } from "@/components/scan-modes/ar-overlay";
import { MaterialMode } from "@/components/scan-modes/material-preview";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "floor", label: "Floor Area", icon: "M3 3h18v18H3V3z", desc: "2D floor plan with sqft" },
  { id: "walls", label: "Wall Area", icon: "M3 3h18v18H3V3zM3 3v18M21 3v18M3 3h18M3 21h18", desc: "Wall sqft minus openings" },
  { id: "blueprint", label: "3D Blueprint", icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9", desc: "Wireframe with dimensions" },
  { id: "render", label: "3D Render", icon: "M21 7.5l-9-5.25L3 7.5v9l9 5.25 9-5.25v-9zM3 7.5l9 5.25M12 21.75V12.5M21 7.5l-9 5", desc: "Full 3D model, AR view" },
  { id: "measure", label: "Measure", icon: "M2 12h4m12 0h4M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83", desc: "Point-to-point distance" },
  { id: "export", label: "Export", icon: "M12 10v6m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2", desc: "PDF floor plan download" },
  { id: "ar", label: "AR Overlay", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", desc: "Live measurements in AR" },
  { id: "material", label: "Materials", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", desc: "Preview materials in AR" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

export default function ScanPage() {
  const [lidarAvailable, setLidarAvailable] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [allScans, setAllScans] = useState<ScanResult[]>([]);
  const [activeMode, setActiveMode] = useState<ModeId>("floor");
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    roomScanner.isAvailable().then(setLidarAvailable).catch(() => {});
  }, []);

  async function handleScan() {
    setScanning(true);
    setScanError("");
    try {
      const result = await roomScanner.scan();
      if (result.rooms?.length > 0) {
        const newScans = [...allScans, result];
        setAllScans(newScans);
        // If multiple scans, average them
        const finalResult = newScans.length > 1 ? averageScans(newScans) : result;
        setScanResult(finalResult);
      } else {
        setScanError("No rooms detected. Stand in center, scan slowly, make sure all walls visible.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Scan failed";
      if (msg !== "Scan cancelled by user") {
        setScanError(msg);
      }
    }
    setScanning(false);
  }

  // Save scan to backend
  useEffect(() => {
    if (!scanResult) return;
    fetch("/api/room-scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomsData: scanResult.rooms,
        surfaceCount: scanResult.surfaceCount,
        usdzBase64: scanResult.usdzBase64 || undefined,
      }),
    }).catch(() => {});
  }, [scanResult]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Room Scanner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            LiDAR-powered room measurement with 8 view modes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allScans.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {allScans.length} scan{allScans.length !== 1 ? "s" : ""}
            </span>
          )}
          <Button
            onClick={handleScan}
            disabled={scanning || !lidarAvailable}
            className="gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
            </svg>
            {scanning ? "Scanning..." : scanResult ? "Scan Again" : "Start Scan"}
          </Button>
        </div>
      </div>

      {!lidarAvailable && (
        <Card>
          <CardContent className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="font-medium mb-1">LiDAR Required</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Open ContractorCalc on an iPhone Pro or iPad Pro with LiDAR to scan rooms.
              You can still use the floor plan editor on this device.
            </p>
          </CardContent>
        </Card>
      )}

      {scanError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
          {scanError}
        </div>
      )}

      {/* Mode Selector — horizontal scroll on mobile, grid on desktop */}
      {scanResult && (
        <>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            <div className="flex md:grid md:grid-cols-4 gap-2 min-w-max md:min-w-0">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 border min-w-[140px] md:min-w-0",
                    activeMode === mode.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={mode.icon} />
                  </svg>
                  <div>
                    <p className="text-xs font-medium">{mode.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight hidden md:block">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Mode Content */}
          <div className="min-h-[400px]">
            {activeMode === "floor" && <FloorAreaMode scan={scanResult} />}
            {activeMode === "walls" && <WallAreaMode scan={scanResult} />}
            {activeMode === "blueprint" && <BlueprintMode scan={scanResult} />}
            {activeMode === "render" && <RenderMode scan={scanResult} />}
            {activeMode === "measure" && <MeasureMode scan={scanResult} />}
            {activeMode === "export" && <ExportMode scan={scanResult} />}
            {activeMode === "ar" && <AROverlayMode scan={scanResult} />}
            {activeMode === "material" && <MaterialMode scan={scanResult} />}
          </div>

          {/* Confidence Panel — always visible at bottom */}
          <ScanConfidencePanel
            scanResult={scanResult}
            onCalibrate={(calibrated) => setScanResult(calibrated)}
            onRescan={handleScan}
          />
        </>
      )}
    </div>
  );
}
