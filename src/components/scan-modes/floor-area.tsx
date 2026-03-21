"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/lib/room-scanner";

const ROOM_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
  "bg-violet-500", "bg-pink-500", "bg-cyan-500", "bg-lime-500",
];

interface Props {
  scan: ScanResult;
}

export function FloorAreaMode({ scan }: Props) {
  const totalFloor = scan.rooms.reduce((s, r) => s + r.floorArea, 0);
  const maxArea = Math.max(...scan.rooms.map((r) => r.floorArea));

  return (
    <div className="space-y-4">
      {/* Total banner */}
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Floor Area</p>
          <p className="text-4xl font-bold tracking-tight">{Math.round(totalFloor).toLocaleString()} sqft</p>
          <p className="text-xs text-muted-foreground mt-2">
            {scan.rooms.length} room{scan.rooms.length !== 1 ? "s" : ""} · {scan.doorCount} door{scan.doorCount !== 1 ? "s" : ""} · {scan.windowCount} window{scan.windowCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Visual floor plan representation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Floor Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scan.rooms.map((room, i) => {
              const pct = maxArea > 0 ? (room.floorArea / maxArea) * 100 : 50;
              const colorClass = ROOM_COLORS[i % ROOM_COLORS.length];

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-sm", colorClass)} />
                      <span className="text-sm font-medium">{room.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{Math.round(room.floorArea)} sqft</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {room.length}&apos; × {room.width}&apos;
                      </span>
                    </div>
                  </div>
                  {/* Proportional bar */}
                  <div className="h-8 rounded-lg bg-muted/30 overflow-hidden relative">
                    <div
                      className={cn("h-full rounded-lg opacity-20", colorClass)}
                      style={{ width: `${pct}%`, transition: "width 0.5s ease" }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {room.length}&apos; × {room.width}&apos;
                        {room.height > 0 ? ` × ${room.height}' h` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Breakdown table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Room</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Length</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Width</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Height</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Floor Sqft</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {scan.rooms.map((room, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{room.name}</td>
                    <td className="py-2.5 text-right font-mono">{room.length}&apos;</td>
                    <td className="py-2.5 text-right font-mono">{room.width}&apos;</td>
                    <td className="py-2.5 text-right font-mono">{room.height}&apos;</td>
                    <td className="py-2.5 text-right font-semibold">{Math.round(room.floorArea)}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        "text-xs font-medium",
                        room.confidence === "high" ? "text-green-600 dark:text-green-400" :
                        room.confidence === "medium" ? "text-yellow-600 dark:text-yellow-400" :
                        "text-red-600 dark:text-red-400"
                      )}>
                        ±{room.accuracyInches <= 1 ? room.accuracyInches.toFixed(1) : Math.round(room.accuracyInches)}&quot;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="pt-3">Total</td>
                  <td className="pt-3" colSpan={3} />
                  <td className="pt-3 text-right">{Math.round(totalFloor)}</td>
                  <td className="pt-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
