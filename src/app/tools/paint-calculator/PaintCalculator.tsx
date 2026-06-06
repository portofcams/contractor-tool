"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function PaintCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("8");
  const [coats, setCoats] = useState(2);
  const [coverage, setCoverage] = useState("350");
  const [doors, setDoors] = useState("0");
  const [windows, setWindows] = useState("0");
  const [ceiling, setCeiling] = useState(false);

  const L = num(length), W = num(width), H = num(height);
  const wallArea = 2 * (L + W) * H;
  const ceilingArea = ceiling ? L * W : 0;
  const deductions = num(doors) * 21 + num(windows) * 15;
  const paintable = Math.max(0, wallArea + ceilingArea - deductions);
  const cov = num(coverage) || 350;
  const gallons = cov > 0 ? Math.ceil((paintable * coats) / cov) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Room</h2>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
          <div><label className={labelCls}>Height (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Doors (−21 sq ft ea)</label>
            <input type="number" inputMode="numeric" min="0" className={inputCls} value={doors} onChange={(e) => setDoors(e.target.value)} /></div>
          <div><label className={labelCls}>Windows (−15 sq ft ea)</label>
            <input type="number" inputMode="numeric" min="0" className={inputCls} value={windows} onChange={(e) => setWindows(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Coats</label>
            <select className={inputCls} value={coats} onChange={(e) => setCoats(Number(e.target.value))}>
              <option value={1}>1 coat</option>
              <option value={2}>2 coats (recommended)</option>
              <option value={3}>3 coats</option>
            </select></div>
          <div><label className={labelCls}>Coverage / gallon</label>
            <input type="number" inputMode="decimal" min="0" className={inputCls} value={coverage} onChange={(e) => setCoverage(e.target.value)} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} className="h-4 w-4" />
          Include the ceiling
        </label>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Paintable area</span><span className="font-semibold tabular-nums">{fmt(paintable)} sq ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Total surface ({coats} {coats === 1 ? "coat" : "coats"})</span><span className="font-semibold tabular-nums">{fmt(paintable * coats)} sq ft</span></div>
        </div>
        <div className="mt-4 rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Paint to buy</div>
          <div className="text-3xl font-bold">{gallons} {gallons === 1 ? "gallon" : "gallons"}</div>
          <div className="text-xs opacity-80">at {cov} sq ft per gallon</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Estimate only. Primer, dark-to-light color changes, and porous or textured surfaces use more.
        </p>
      </div>
    </div>
  );
}
