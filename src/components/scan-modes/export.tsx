"use client";

import { useRef, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

/**
 * Export mode — generates downloadable PDF floor plan and CSV data.
 * Polycam charges for this. We include it free.
 */
export function ExportMode({ scan }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawFloorPlan = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      const PADDING = 60;
      const rooms = scan.rooms;
      const totalLength = rooms.reduce((s, r) => s + r.length, 0) + (rooms.length - 1) * 2;
      const maxWidth = Math.max(...rooms.map((r) => r.width));
      const scale = Math.min((w - PADDING * 2) / totalLength, (h - PADDING * 2 - 80) / maxWidth);

      // Title
      ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#1d1d1f";
      ctx.textAlign = "left";
      ctx.fillText("Floor Plan — ProBuildCalc", PADDING, 30);
      ctx.font = "11px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#86868b";
      ctx.fillText(`${rooms.length} rooms · ${Math.round(rooms.reduce((s, r) => s + r.floorArea, 0))} total sqft · ${new Date().toLocaleDateString()}`, PADDING, 48);

      const startY = 70;

      // Draw rooms
      let ox = PADDING;
      for (const room of rooms) {
        const rw = room.length * scale;
        const rh = room.width * scale;

        // Fill
        ctx.fillStyle = "rgba(0, 113, 227, 0.06)";
        ctx.fillRect(ox, startY, rw, rh);

        // Border
        ctx.strokeStyle = "#0071e3";
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, startY, rw, rh);

        // Room name + dimensions
        ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#1d1d1f";
        ctx.fillText(room.name, ox + rw / 2, startY + rh / 2 - 8);
        ctx.font = "10px system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "#86868b";
        ctx.fillText(`${room.length}' × ${room.width}' = ${Math.round(room.floorArea)} sqft`, ox + rw / 2, startY + rh / 2 + 8);

        // Edge dimensions
        ctx.font = "9px system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "#1d1d1f";
        ctx.fillText(`${room.length}'`, ox + rw / 2, startY - 8);
        ctx.save();
        ctx.translate(ox + rw + 16, startY + rh / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(`${room.width}'`, 0, 0);
        ctx.restore();

        // Confidence indicator
        const confColor = room.confidence === "high" ? "#34c759" : room.confidence === "medium" ? "#ff9500" : "#ff3b30";
        ctx.fillStyle = confColor;
        ctx.beginPath();
        ctx.arc(ox + 10, startY + 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "8px system-ui, -apple-system, sans-serif";
        ctx.fillText(`±${room.accuracyInches}"`, ox + 18, startY + 13);

        ox += rw + 2 * scale;
      }

      // Summary table at bottom
      const tableY = startY + maxWidth * scale + 30;
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#1d1d1f";
      ctx.textAlign = "left";
      ctx.fillText("Room", PADDING, tableY);
      ctx.fillText("L × W", PADDING + 120, tableY);
      ctx.fillText("Floor Sqft", PADDING + 220, tableY);
      ctx.fillText("Wall Sqft", PADDING + 310, tableY);
      ctx.fillText("Accuracy", PADDING + 400, tableY);

      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(PADDING, tableY + 6);
      ctx.lineTo(w - PADDING, tableY + 6);
      ctx.stroke();

      ctx.font = "10px system-ui, -apple-system, sans-serif";
      let rowY = tableY + 20;
      for (const room of rooms) {
        ctx.fillStyle = "#1d1d1f";
        ctx.fillText(room.name, PADDING, rowY);
        ctx.fillStyle = "#86868b";
        ctx.fillText(`${room.length}' × ${room.width}'`, PADDING + 120, rowY);
        ctx.fillText(`${Math.round(room.floorArea)}`, PADDING + 220, rowY);
        ctx.fillText(`${Math.round(room.wallArea)}`, PADDING + 310, rowY);
        const confColor = room.confidence === "high" ? "#34c759" : room.confidence === "medium" ? "#ff9500" : "#ff3b30";
        ctx.fillStyle = confColor;
        ctx.fillText(`±${room.accuracyInches}" (${room.confidence})`, PADDING + 400, rowY);
        rowY += 16;
      }

      // Total
      ctx.beginPath();
      ctx.moveTo(PADDING, rowY - 4);
      ctx.lineTo(w - PADDING, rowY - 4);
      ctx.stroke();
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#1d1d1f";
      ctx.fillText("TOTAL", PADDING, rowY + 10);
      ctx.fillText(`${Math.round(scan.rooms.reduce((s, r) => s + r.floorArea, 0))}`, PADDING + 220, rowY + 10);
      ctx.fillText(`${Math.round(scan.rooms.reduce((s, r) => s + r.wallArea, 0))}`, PADDING + 310, rowY + 10);
    },
    [scan]
  );

  function downloadPDF() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawFloorPlan(ctx, 1200, 800);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `floor-plan-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  function downloadCSV() {
    const headers = "Room,Length (ft),Width (ft),Height (ft),Floor Sqft,Wall Sqft,Confidence,Accuracy (in)\n";
    const rows = scan.rooms
      .map((r) => `${r.name},${r.length},${r.width},${r.height},${r.floorArea},${r.wallArea},${r.confidence},${r.accuracyInches}`)
      .join("\n");

    const totals = `\nTOTAL,,,,"${Math.round(scan.rooms.reduce((s, r) => s + r.floorArea, 0))}","${Math.round(scan.rooms.reduce((s, r) => s + r.wallArea, 0))}",,`;

    const blob = new Blob([headers + rows + totals], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `room-measurements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadUSDZ() {
    if (!scan.usdzBase64) return;
    const binary = atob(scan.usdzBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "model/vnd.usdz+zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `room-scan-${new Date().toISOString().slice(0, 10)}.usdz`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Export Floor Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your scan as a floor plan image, spreadsheet, or 3D model. All exports include dimensions, areas, and confidence ratings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={downloadPDF}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Floor Plan Image</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG with dimensions, areas, and accuracy indicators</p>
              </div>
            </button>

            <button
              onClick={downloadCSV}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Spreadsheet (CSV)</p>
                <p className="text-xs text-muted-foreground mt-0.5">All measurements in Excel-compatible format</p>
              </div>
            </button>

            <button
              onClick={downloadUSDZ}
              disabled={!scan.usdzBase64}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">3D Model (USDZ)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {scan.usdzBase64 ? "Open in any 3D viewer or AR app" : "No 3D model available for this scan"}
                </p>
              </div>
            </button>

            {/* Inspection Report PDF */}
            <InspectionReportButton scan={scan} />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Export Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={(el) => {
              if (el && canvasRef.current !== el) {
                (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = el;
                const ctx = el.getContext("2d");
                if (ctx) {
                  const dpr = window.devicePixelRatio || 1;
                  el.width = el.clientWidth * dpr;
                  el.height = el.clientHeight * dpr;
                  ctx.scale(dpr, dpr);
                  drawFloorPlan(ctx, el.clientWidth, el.clientHeight);
                }
              }
            }}
            className="w-full rounded-lg border border-border"
            style={{ height: 300 }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/** Inspection Report PDF download button */
function InspectionReportButton({ scan }: { scan: ScanResult }) {
  const [generating, setGenerating] = useState(false);

  async function downloadInspectionReport() {
    setGenerating(true);
    try {
      const res = await fetch("/api/inspection-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan }),
      });
      if (!res.ok) throw new Error("Failed to generate report");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inspection-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate inspection report. Please try again.");
    }
    setGenerating(false);
  }

  return (
    <button
      onClick={downloadInspectionReport}
      disabled={generating}
      className="flex items-start gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left disabled:opacity-60 md:col-span-3"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium">{generating ? "Generating..." : "Inspection Report (PDF)"}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Professional report with room measurements, confidence ratings, material estimates, and recommendations
        </p>
      </div>
    </button>
  );
}
