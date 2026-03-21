"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/lib/room-scanner";

interface Props {
  scan: ScanResult;
}

export function WallAreaMode({ scan }: Props) {
  const totalWallArea = scan.rooms.reduce((s, r) => s + r.wallArea, 0);
  const totalDoorArea = scan.confidence.doorDetails.reduce((s, d) => s + d.areaFt, 0);
  const totalWindowArea = scan.confidence.windowDetails.reduce((s, w) => s + w.areaFt, 0);
  const totalOpeningArea = totalDoorArea + totalWindowArea;
  const paintableArea = totalWallArea - totalOpeningArea;

  // Paint coverage: 1 gallon = ~350 sqft per coat
  const gallonsPerCoat = paintableArea / 350;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Gross Wall Area</p>
            <p className="text-2xl font-bold">{Math.round(totalWallArea)}</p>
            <p className="text-xs text-muted-foreground">sqft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Openings</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">-{Math.round(totalOpeningArea)}</p>
            <p className="text-xs text-muted-foreground">sqft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Paintable Area</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(paintableArea)}</p>
            <p className="text-xs text-muted-foreground">sqft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Paint Needed</p>
            <p className="text-2xl font-bold">{Math.ceil(gallonsPerCoat)}</p>
            <p className="text-xs text-muted-foreground">gal/coat</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-room wall breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Wall Area by Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scan.rooms.map((room, i) => {
            const roomDoorArea = 0; // TODO: per-room door tracking
            const netArea = room.wallArea; // Gross for now

            return (
              <div key={i} className="p-3 rounded-lg bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{room.name}</span>
                  <span className="text-sm font-semibold">{Math.round(netArea)} sqft walls</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block text-foreground font-medium">{room.length}&apos;</span>
                    Length
                  </div>
                  <div>
                    <span className="block text-foreground font-medium">{room.width}&apos;</span>
                    Width
                  </div>
                  <div>
                    <span className="block text-foreground font-medium">{room.height}&apos;</span>
                    Ceiling
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Perimeter: {Math.round(2 * (room.length + room.width))}&apos; ·
                  Wall area = perimeter × {room.height}&apos; height
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Doors & Windows */}
      {(scan.confidence.doorDetails.length > 0 || scan.confidence.windowDetails.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Openings (Subtract from Wall Area)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scan.confidence.doorDetails.map((door, i) => (
              <div key={`d-${i}`} className="flex items-center justify-between text-sm p-2 rounded bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center">D</span>
                  <span>Door {i + 1}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {door.widthFt}&apos; × {door.heightFt}&apos; = {Math.round(door.areaFt)} sqft
                </span>
              </div>
            ))}
            {scan.confidence.windowDetails.map((win, i) => (
              <div key={`w-${i}`} className="flex items-center justify-between text-sm p-2 rounded bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-sky-500/10 text-sky-500 text-xs font-bold flex items-center justify-center">W</span>
                  <span>Window {i + 1}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {win.widthFt}&apos; × {win.heightFt}&apos; = {Math.round(win.areaFt)} sqft
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border text-sm font-medium">
              <span>Total openings</span>
              <span>{Math.round(totalOpeningArea)} sqft</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contractor tips */}
      <Card>
        <CardContent className="py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Quick Estimates</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2.5 rounded-lg bg-muted/20">
              <p className="font-medium">Baseboard</p>
              <p className="text-muted-foreground text-xs">{Math.round(scan.rooms.reduce((s, r) => s + 2 * (r.length + r.width), 0))} linear ft</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/20">
              <p className="font-medium">Crown Molding</p>
              <p className="text-muted-foreground text-xs">{Math.round(scan.rooms.reduce((s, r) => s + 2 * (r.length + r.width), 0))} linear ft</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/20">
              <p className="font-medium">2 Coats Paint</p>
              <p className="text-muted-foreground text-xs">{Math.ceil(gallonsPerCoat * 2)} gallons</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/20">
              <p className="font-medium">Primer + 2 Coats</p>
              <p className="text-muted-foreground text-xs">{Math.ceil(gallonsPerCoat * 3)} gallons</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
