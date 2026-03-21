"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

/**
 * 3D Blueprint mode — renders a wireframe isometric view of the scanned rooms
 * with dimension labels on every edge. Pure canvas, no dependencies.
 */
export function BlueprintMode({ scan }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotateY, setRotateY] = useState(30);
  const [rotateX, setRotateX] = useState(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, w, h);

    const rooms = scan.rooms;
    if (rooms.length === 0) return;

    // Simple isometric projection
    const angleY = (rotateY * Math.PI) / 180;
    const angleX = (rotateX * Math.PI) / 180;
    const scale = Math.min(w, h) / (Math.max(...rooms.map((r) => Math.max(r.length, r.width))) * 4);
    const cx = w / 2;
    const cy = h / 2 + 40;

    function project(x: number, y: number, z: number): [number, number] {
      // Rotate around Y axis
      const rx = x * Math.cos(angleY) - z * Math.sin(angleY);
      const rz = x * Math.sin(angleY) + z * Math.cos(angleY);
      // Rotate around X axis
      const ry = y * Math.cos(angleX) - rz * Math.sin(angleX);
      const rz2 = y * Math.sin(angleX) + rz * Math.cos(angleX);
      // Project to 2D (simple perspective)
      const perspective = 500;
      const factor = perspective / (perspective + rz2);
      return [cx + rx * scale * factor, cy - ry * scale * factor];
    }

    function drawLine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: string, lineWidth = 1.5) {
      const [sx1, sy1] = project(x1, y1, z1);
      const [sx2, sy2] = project(x2, y2, z2);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    function drawLabel(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, text: string) {
      const [sx1, sy1] = project(x1, y1, z1);
      const [sx2, sy2] = project(x2, y2, z2);
      const mx = (sx1 + sx2) / 2;
      const my = (sy1 + sy2) / 2;

      ctx.save();
      ctx.font = "11px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Background pill
      const metrics = ctx.measureText(text);
      const pw = metrics.width + 8;
      const ph = 16;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.beginPath();
      ctx.roundRect(mx - pw / 2, my - ph / 2, pw, ph, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, mx, my);
      ctx.restore();
    }

    const isDark = document.documentElement.classList.contains("dark");
    const wallColor = isDark ? "rgba(10, 132, 255, 0.8)" : "rgba(0, 113, 227, 0.7)";
    const floorColor = isDark ? "rgba(10, 132, 255, 0.15)" : "rgba(0, 113, 227, 0.08)";
    const edgeColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";

    let offsetX = 0;
    for (const room of rooms) {
      const l = room.length;
      const wi = room.width;
      const h = room.height || 8;
      const ox = offsetX;

      // Floor (filled quad)
      const [f1x, f1y] = project(ox, 0, 0);
      const [f2x, f2y] = project(ox + l, 0, 0);
      const [f3x, f3y] = project(ox + l, 0, wi);
      const [f4x, f4y] = project(ox, 0, wi);
      ctx.beginPath();
      ctx.moveTo(f1x, f1y);
      ctx.lineTo(f2x, f2y);
      ctx.lineTo(f3x, f3y);
      ctx.lineTo(f4x, f4y);
      ctx.closePath();
      ctx.fillStyle = floorColor;
      ctx.fill();

      // Floor edges
      drawLine(ox, 0, 0, ox + l, 0, 0, wallColor);
      drawLine(ox + l, 0, 0, ox + l, 0, wi, wallColor);
      drawLine(ox + l, 0, wi, ox, 0, wi, wallColor);
      drawLine(ox, 0, wi, ox, 0, 0, wallColor);

      // Vertical edges (walls)
      drawLine(ox, 0, 0, ox, h, 0, wallColor);
      drawLine(ox + l, 0, 0, ox + l, h, 0, wallColor);
      drawLine(ox + l, 0, wi, ox + l, h, wi, wallColor);
      drawLine(ox, 0, wi, ox, h, wi, wallColor);

      // Top edges
      drawLine(ox, h, 0, ox + l, h, 0, edgeColor);
      drawLine(ox + l, h, 0, ox + l, h, wi, edgeColor);
      drawLine(ox + l, h, wi, ox, h, wi, edgeColor);
      drawLine(ox, h, wi, ox, h, 0, edgeColor);

      // Dimension labels
      drawLabel(ox, 0, 0, ox + l, 0, 0, `${l}'`);
      drawLabel(ox + l, 0, 0, ox + l, 0, wi, `${wi}'`);
      drawLabel(ox + l, 0, 0, ox + l, h, 0, `${h}'`);

      // Room name
      const [namex, namey] = project(ox + l / 2, h + 1.5, wi / 2);
      ctx.save();
      ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isDark ? "#f5f5f7" : "#1d1d1f";
      ctx.fillText(room.name, namex, namey);
      ctx.font = "10px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = isDark ? "#98989d" : "#86868b";
      ctx.fillText(`${Math.round(room.floorArea)} sqft`, namex, namey + 14);
      ctx.restore();

      offsetX += l + 3;
    }
  }, [scan, rotateY, rotateX]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">3D Blueprint</CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => setRotateY((r) => r - 15)}>
                Rotate L
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => setRotateY((r) => r + 15)}>
                Rotate R
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => setRotateX((r) => Math.min(60, r + 10))}>
                Tilt
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => { setRotateY(30); setRotateX(20); }}>
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg bg-card"
            style={{ height: 400 }}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Wireframe blueprint with all dimensions labeled. Rotate to inspect from any angle.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
