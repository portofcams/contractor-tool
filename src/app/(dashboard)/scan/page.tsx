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
import { RoomPhotoGallery } from "@/components/room-photo-gallery";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "floor", label: "Floor", icon: "M3 3h18v18H3V3z" },
  { id: "walls", label: "Walls", icon: "M3 3h18v18H3V3zM3 3v18M21 3v18M3 3h18M3 21h18" },
  { id: "blueprint", label: "3D", icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" },
  { id: "render", label: "Render", icon: "M21 7.5l-9-5.25L3 7.5v9l9 5.25 9-5.25v-9zM3 7.5l9 5.25M12 21.75V12.5M21 7.5l-9 5" },
  { id: "measure", label: "Measure", icon: "M2 12h4m12 0h4M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" },
  { id: "export", label: "Export", icon: "M12 10v6m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" },
  { id: "ar", label: "AR", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id: "material", label: "Materials", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
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

  // Pre-scan view
  if (!scanResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-sm mx-auto space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Room Scanner</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Scan any room with LiDAR to get instant measurements, floor plans, and material estimates.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3 text-left">
            {[
              { label: "Floor & wall area", desc: "Automatic sqft calculation" },
              { label: "Confidence scoring", desc: "Know which measurements to verify" },
              { label: "8 view modes", desc: "Floor plan, 3D, measure, export, AR" },
              { label: "Inspection report", desc: "Professional PDF with one tap" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scan button */}
          {lidarAvailable ? (
            <Button
              onClick={handleScan}
              disabled={scanning}
              size="lg"
              className="w-full h-14 text-base font-semibold rounded-2xl gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
              </svg>
              {scanning ? "Scanning..." : "Start Room Scan"}
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/50 text-center">
              <p className="text-sm font-medium mb-1">LiDAR Required</p>
              <p className="text-xs text-muted-foreground">
                Open on iPhone Pro or iPad Pro to scan rooms with LiDAR.
              </p>
            </div>
          )}

          {scanError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {scanError}
            </div>
          )}

          {allScans.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {allScans.length} scan{allScans.length !== 1 ? "s" : ""} completed
            </p>
          )}
        </div>
      </div>
    );
  }

  // Post-scan view with modes
  const totalSqft = scanResult.rooms.reduce((s, r) => s + r.floorArea, 0);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header — compact on mobile */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight truncate">
            {Math.round(totalSqft).toLocaleString()} sqft
          </h1>
          <p className="text-xs text-muted-foreground">
            {scanResult.rooms.length} room{scanResult.rooms.length !== 1 ? "s" : ""} · {scanResult.wallCount} walls · {scanResult.doorCount} doors
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {allScans.length > 0 && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {allScans.length}x
            </span>
          )}
          <Button
            onClick={handleScan}
            disabled={scanning}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
            </svg>
            {scanning ? "..." : "Rescan"}
          </Button>
        </div>
      </div>

      {scanError && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {scanError}
        </div>
      )}

      {/* Mode tabs — horizontal scroll on mobile, pills style */}
      <div className="overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                activeMode === mode.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={mode.icon} />
              </svg>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active mode content */}
      <div className="min-h-[300px]">
        {activeMode === "floor" && <FloorAreaMode scan={scanResult} />}
        {activeMode === "walls" && <WallAreaMode scan={scanResult} />}
        {activeMode === "blueprint" && <BlueprintMode scan={scanResult} />}
        {activeMode === "render" && <RenderMode scan={scanResult} />}
        {activeMode === "measure" && <MeasureMode scan={scanResult} />}
        {activeMode === "export" && <ExportMode scan={scanResult} />}
        {activeMode === "ar" && <AROverlayMode scan={scanResult} />}
        {activeMode === "material" && <MaterialMode scan={scanResult} />}
      </div>

      {/* Room Photos */}
      <details className="group" open>
        <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-medium">
          <span>Room Photos</span>
          <svg className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="pt-2">
          <RoomPhotoGallery rooms={scanResult.rooms.map((r) => ({ name: r.name }))} />
        </div>
      </details>

      {/* Confidence — collapsible on mobile */}
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-medium">
          <span>Scan Accuracy</span>
          <svg className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="pt-2">
          <ScanConfidencePanel
            scanResult={scanResult}
            onCalibrate={(calibrated) => setScanResult(calibrated)}
            onRescan={handleScan}
          />
        </div>
      </details>
    </div>
  );
}
