"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  ScanResult,
  ScanConfidence,
  ScannedRoom,
  ConfidenceLevel,
  CalibrationData,
} from "@/lib/room-scanner";
import { calibrateScan } from "@/lib/room-scanner";

interface ScanConfidenceProps {
  scanResult: ScanResult;
  onCalibrate?: (calibratedResult: ScanResult) => void;
  onRescan?: () => void;
}

const gradeConfig: Record<
  ConfidenceLevel,
  { label: string; color: string; bg: string; ring: string }
> = {
  high: {
    label: "High Confidence",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    ring: "ring-green-500/20",
  },
  medium: {
    label: "Medium Confidence",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
    ring: "ring-yellow-500/20",
  },
  low: {
    label: "Needs Verification",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-500/20",
  },
};

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = gradeConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
        config.bg,
        config.color,
        config.ring
      )}
    >
      {config.label}
    </span>
  );
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "stroke-green-500"
      : score >= 55
      ? "stroke-yellow-500"
      : "stroke-red-500";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-muted/30"
          strokeWidth={4}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={color}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-semibold">{Math.round(score)}</span>
    </div>
  );
}

function AccuracyBar({ inches, label }: { inches: number; label: string }) {
  // Map accuracy to a visual bar (lower = better)
  const pct = Math.max(5, Math.min(100, (1 - inches / 5) * 100));
  const color =
    inches <= 1
      ? "bg-green-500"
      : inches <= 2.5
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">+/- {inches <= 1 ? inches.toFixed(1) : Math.round(inches)}&quot;</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ScanConfidencePanel({
  scanResult,
  onCalibrate,
  onRescan,
}: ScanConfidenceProps) {
  const { confidence, rooms } = scanResult;
  const [showCalibrate, setShowCalibrate] = useState(false);
  const [calRoomIdx, setCalRoomIdx] = useState(0);
  const [calDimension, setCalDimension] = useState<"length" | "width">("length");
  const [calValue, setCalValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  function handleCalibrate() {
    const actual = parseFloat(calValue);
    if (isNaN(actual) || actual <= 0) return;

    const calibration: CalibrationData = {
      roomIndex: calRoomIdx,
      dimension: calDimension,
      actualFeet: actual,
    };

    const calibrated = calibrateScan(scanResult, calibration);
    onCalibrate?.(calibrated);
    setShowCalibrate(false);
    setCalValue("");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Scan Accuracy</CardTitle>
          <ConfidenceBadge level={confidence.overallGrade} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score + Coverage */}
        <div className="flex items-center gap-6">
          <ScoreRing score={confidence.overallScore} />
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm font-medium">
                {confidence.overallScore >= 80
                  ? "Ready to use"
                  : confidence.overallScore >= 55
                  ? "Usable with caution"
                  : "Manual verification needed"}
              </p>
              <p className="text-xs text-muted-foreground">
                {confidence.coveragePct}% coverage · {scanResult.wallCount} walls · {scanResult.doorCount} doors · {scanResult.windowCount} windows
              </p>
            </div>
            <AccuracyBar
              inches={rooms[0]?.accuracyInches ?? 2}
              label="Best measurement accuracy"
            />
          </div>
        </div>

        {/* Per-room breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Per-Room Accuracy
          </p>
          {rooms.map((room, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg",
                room.confidence === "low" ? "bg-red-500/5" : "bg-muted/30"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{room.name}</p>
                  <ConfidenceBadge level={room.confidence} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {room.length}&apos; x {room.width}&apos; · {room.floorArea} sqft
                  {room.height > 0 ? ` · ${room.height}' ceiling` : ""}
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-medium">
                  +/- {room.accuracyInches <= 1 ? room.accuracyInches.toFixed(1) : Math.round(room.accuracyInches)}&quot;
                </p>
                <p className="text-xs text-muted-foreground">
                  {room.accuracyPct}% error
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {confidence.recommendations.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recommendations
            </p>
            {confidence.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className={confidence.shouldVerify ? "text-yellow-500" : "text-green-500"}>
                  {confidence.shouldVerify ? "!" : "\u2713"}
                </span>
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wall details (expandable) */}
        {confidence.wallDetails.length > 0 && (
          <details open={expanded} onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)}>
            <summary className="text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
              Wall Details ({confidence.wallDetails.length})
            </summary>
            <div className="mt-2 space-y-1">
              {confidence.wallDetails.map((wall, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded bg-muted/20"
                >
                  <span>
                    Wall {wall.index + 1}: {wall.lengthFt}&apos; x {wall.heightFt}&apos; ({wall.areaFt} sqft)
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      wall.confidence === "high"
                        ? "text-green-600 dark:text-green-400"
                        : wall.confidence === "medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    +/- {wall.accuracyInches <= 1 ? wall.accuracyInches.toFixed(1) : Math.round(wall.accuracyInches)}&quot;
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {onCalibrate && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setShowCalibrate(!showCalibrate)}
            >
              {showCalibrate ? "Cancel" : "Calibrate with Tape Measure"}
            </Button>
          )}
          {onRescan && (
            <Button variant="outline" size="sm" className="text-xs" onClick={onRescan}>
              Scan Again
            </Button>
          )}
        </div>

        {/* Calibration form */}
        {showCalibrate && (
          <div className="p-3 rounded-lg bg-muted/30 space-y-3">
            <p className="text-sm font-medium">Reference Calibration</p>
            <p className="text-xs text-muted-foreground">
              Measure one wall or dimension with a tape measure. We&apos;ll use this to correct all
              other measurements, cutting error by ~60%.
            </p>
            <div className="flex gap-2">
              <select
                value={calRoomIdx}
                onChange={(e) => setCalRoomIdx(Number(e.target.value))}
                className="text-sm rounded-md border border-input bg-background px-2 py-1.5"
              >
                {rooms.map((r, i) => (
                  <option key={i} value={i}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                value={calDimension}
                onChange={(e) => setCalDimension(e.target.value as "length" | "width")}
                className="text-sm rounded-md border border-input bg-background px-2 py-1.5"
              >
                <option value="length">Length ({rooms[calRoomIdx]?.length}&apos;)</option>
                <option value="width">Width ({rooms[calRoomIdx]?.width}&apos;)</option>
              </select>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Actual measurement (feet)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={calValue}
                  onChange={(e) => setCalValue(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                size="sm"
                onClick={handleCalibrate}
                disabled={!calValue || parseFloat(calValue) <= 0}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
