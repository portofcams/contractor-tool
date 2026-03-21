"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

/**
 * AR Overlay mode — launches an AR session that displays room measurements
 * floating in real space. Uses the scan data to position dimension labels
 * at wall edges and corners.
 *
 * On web/non-AR devices, shows a preview of what the AR view looks like.
 */
export function AROverlayMode({ scan }: Props) {
  const [arAvailable, setArAvailable] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    // AR overlay requires native iOS with the USDZ model
    setArAvailable(
      Capacitor.isNativePlatform() &&
      Capacitor.getPlatform() === "ios" &&
      !!scan.usdzBase64
    );
  }, [scan]);

  function launchAR() {
    if (!scan.usdzBase64) return;
    setLaunching(true);

    // Create a temporary USDZ file and open in AR Quick Look
    const binary = atob(scan.usdzBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "model/vnd.usdz+zip" });
    const url = URL.createObjectURL(blob);

    // AR Quick Look via anchor tag
    const a = document.createElement("a");
    a.rel = "ar";
    a.href = url;
    a.appendChild(document.createElement("img")); // required for AR Quick Look
    a.click();

    setTimeout(() => setLaunching(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">AR Measurement Overlay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {arAvailable ? (
            <>
              <p className="text-sm text-muted-foreground">
                View your room scan in augmented reality. The 3D model will be placed in your real space
                with all dimensions visible — walk around to inspect measurements from any angle.
              </p>
              <Button onClick={launchAR} disabled={launching} className="w-full gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {launching ? "Opening AR..." : "Launch AR View"}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="font-medium mb-1">AR Requires iPhone Pro</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Open this page on an iPhone or iPad Pro with LiDAR to view your room scan in augmented reality.
              </p>
            </div>
          )}

          {/* Measurement summary shown alongside AR */}
          <div className="grid grid-cols-2 gap-3">
            {scan.rooms.map((room, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20">
                <p className="text-sm font-medium mb-1">{room.name}</p>
                <div className="space-y-0.5 text-xs text-muted-foreground">
                  <p>Floor: {Math.round(room.floorArea)} sqft</p>
                  <p>Walls: {Math.round(room.wallArea)} sqft</p>
                  <p>Ceiling: {room.height}&apos; high</p>
                  <p>Dims: {room.length}&apos; × {room.width}&apos;</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
