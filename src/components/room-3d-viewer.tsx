"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Room3DViewerProps {
  modelUrl: string;
  roomName?: string;
}

/**
 * 3D Room Viewer — renders USDZ models from LiDAR scans.
 * Uses Google's <model-viewer> web component for interactive 3D viewing.
 * On iOS, taps "View in AR" to open native AR Quick Look.
 */
export function Room3DViewer({ modelUrl, roomName }: Room3DViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  if (!showViewer) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowViewer(true)}
        className="gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
        View 3D Model
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          {roomName ? `3D Model: ${roomName}` : "3D Room Model"}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowViewer(false)}
          className="text-xs"
        >
          Hide
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden bg-secondary" style={{ height: 350 }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
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
          src={modelUrl}
          ios-src={modelUrl}
          alt={roomName || "3D room scan"}
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          shadow-intensity="1"
          style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
          onLoad={() => setLoaded(true)}
        >
          <button
            slot="ar-button"
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
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

      {/* Download link */}
      <div className="flex gap-2">
        <a
          href={modelUrl}
          download="room-scan.usdz"
          className="text-xs text-primary hover:underline"
        >
          Download USDZ
        </a>
      </div>
    </div>
  );
}

/**
 * ModelViewerScript — loads the model-viewer web component script.
 * Include this once in your layout or page.
 */
export function ModelViewerScript() {
  return (
    <script
      type="module"
      src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
      async
    />
  );
}
