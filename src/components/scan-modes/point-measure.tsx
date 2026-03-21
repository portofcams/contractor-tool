"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/lib/room-scanner";

interface Point {
  x: number;
  y: number;
  roomFtX: number;
  roomFtY: number;
}

interface Measurement {
  from: Point;
  to: Point;
  distanceFt: number;
}

interface Props {
  scan: ScanResult;
}

/**
 * Point-to-Point Measure mode — tap two points on the floor plan to get
 * the distance between them. Like Polycam's measure tool but on a 2D plan.
 */
export function MeasureMode({ scan }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const PADDING = 40;
  const rooms = scan.rooms;

  // Calculate layout
  const totalLength = rooms.reduce((s, r) => s + r.length, 0) + (rooms.length - 1) * 2;
  const maxWidth = Math.max(...rooms.map((r) => r.width));

  const getScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 10;
    const availW = canvas.clientWidth - PADDING * 2;
    const availH = canvas.clientHeight - PADDING * 2;
    return Math.min(availW / totalLength, availH / maxWidth);
  }, [totalLength, maxWidth]);

  // Convert canvas coords to room feet
  function canvasToFeet(cx: number, cy: number): { ftX: number; ftY: number } {
    const scale = getScale();
    return {
      ftX: Math.round(((cx - PADDING) / scale) * 10) / 10,
      ftY: Math.round(((cy - PADDING) / scale) * 10) / 10,
    };
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const { ftX, ftY } = canvasToFeet(cx, cy);

    const point: Point = { x: cx, y: cy, roomFtX: ftX, roomFtY: ftY };

    if (activePoint) {
      // Second point — complete measurement
      const dx = point.roomFtX - activePoint.roomFtX;
      const dy = point.roomFtY - activePoint.roomFtY;
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;

      setMeasurements((prev) => [...prev, { from: activePoint, to: point, distanceFt: dist }]);
      setPoints((prev) => [...prev, point]);
      setActivePoint(null);
    } else {
      // First point
      setActivePoint(point);
      setPoints((prev) => [...prev, point]);
    }
  }

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.classList.contains("dark");
    const scale = getScale();

    // Draw rooms
    let ox = PADDING;
    for (const room of rooms) {
      const rw = room.length * scale;
      const rh = room.width * scale;

      // Fill
      ctx.fillStyle = isDark ? "rgba(10, 132, 255, 0.1)" : "rgba(0, 113, 227, 0.06)";
      ctx.fillRect(ox, PADDING, rw, rh);

      // Border
      ctx.strokeStyle = isDark ? "rgba(10, 132, 255, 0.4)" : "rgba(0, 113, 227, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox, PADDING, rw, rh);

      // Label
      ctx.save();
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isDark ? "#f5f5f7" : "#1d1d1f";
      ctx.fillText(room.name, ox + rw / 2, PADDING + rh / 2 - 6);
      ctx.font = "10px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = isDark ? "#98989d" : "#86868b";
      ctx.fillText(`${room.length}' × ${room.width}'`, ox + rw / 2, PADDING + rh / 2 + 8);
      ctx.restore();

      // Dimension labels on edges
      ctx.save();
      ctx.font = "9px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = isDark ? "#98989d" : "#86868b";
      ctx.textAlign = "center";
      ctx.fillText(`${room.length}'`, ox + rw / 2, PADDING - 6);
      ctx.save();
      ctx.translate(ox + rw + 14, PADDING + rh / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(`${room.width}'`, 0, 0);
      ctx.restore();
      ctx.restore();

      ox += rw + 2 * scale;
    }

    // Draw measurement lines
    for (const m of measurements) {
      ctx.beginPath();
      ctx.moveTo(m.from.x, m.from.y);
      ctx.lineTo(m.to.x, m.to.y);
      ctx.strokeStyle = isDark ? "#ff453a" : "#ff3b30";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Distance label
      const mx = (m.from.x + m.to.x) / 2;
      const my = (m.from.y + m.to.y) / 2;
      ctx.save();
      ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      const label = `${m.distanceFt}'`;
      const lw = ctx.measureText(label).width + 10;
      ctx.fillStyle = isDark ? "rgba(255, 69, 58, 0.9)" : "rgba(255, 59, 48, 0.9)";
      ctx.beginPath();
      ctx.roundRect(mx - lw / 2, my - 10, lw, 20, 6);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, mx, my + 4);
      ctx.restore();
    }

    // Draw points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#ff453a" : "#ff3b30";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Active point indicator
    if (activePoint) {
      ctx.beginPath();
      ctx.arc(activePoint.x, activePoint.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? "#ff453a" : "#ff3b30";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [scan, measurements, points, activePoint, getScale, rooms]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Point-to-Point Measure</CardTitle>
            <div className="flex gap-2">
              {measurements.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => { setMeasurements([]); setPoints([]); setActivePoint(null); }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            {activePoint
              ? "Tap a second point to measure the distance"
              : "Tap any two points on the floor plan to measure the distance between them"}
          </p>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg bg-card border border-border cursor-crosshair"
            style={{ height: 350 }}
            onClick={handleCanvasClick}
          />
        </CardContent>
      </Card>

      {/* Measurement history */}
      {measurements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Measurements ({measurements.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {measurements.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/20">
                <span className="text-muted-foreground">
                  ({m.from.roomFtX}&apos;, {m.from.roomFtY}&apos;) → ({m.to.roomFtX}&apos;, {m.to.roomFtY}&apos;)
                </span>
                <span className="font-semibold text-destructive">{m.distanceFt}&apos;</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
