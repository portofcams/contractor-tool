"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function DrywallCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("8");
  const [ceiling, setCeiling] = useState(true);
  const [sheet, setSheet] = useState("32");
  const [waste, setWaste] = useState(10);

  const L = num(length), W = num(width), H = num(height);
  const wallArea = 2 * (L + W) * H;
  const ceilingArea = ceiling ? L * W : 0;
  const total = wallArea + ceilingArea;
  const withWaste = total * (1 + waste / 100);
  const sheetSqft = num(sheet) || 32;
  const sheets = sheetSqft > 0 ? Math.ceil(withWaste / sheetSqft) : 0;
  const screws = Math.ceil(sheets * 32);
  const compound = Math.ceil(total * 0.053); // lbs of joint compound
  const tape = Math.ceil(total * 0.4); // linear ft of tape

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
          <div><label className={labelCls}>Sheet size</label>
            <select className={inputCls} value={sheet} onChange={(e) => setSheet(e.target.value)}>
              <option value="32">4 × 8 ft (32 sq ft)</option>
              <option value="48">4 × 12 ft (48 sq ft)</option>
              <option value="40">4 × 10 ft (40 sq ft)</option>
            </select></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10% (recommended)</option>
              <option value={15}>15%</option>
              <option value={5}>5%</option>
            </select></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} className="h-4 w-4" />
          Include the ceiling
        </label>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-600 dark:text-neutral-400">Board area (+{waste}% waste)</span>
          <span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Drywall sheets</div>
          <div className="text-3xl font-bold">{sheets}</div>
          <div className="text-xs opacity-80">{sheetSqft} sq ft each</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="Screws (approx)" value={`${screws.toLocaleString("en-US")}`} />
          <Row label="Joint compound" value={`~${compound} lb`} />
          <Row label="Joint tape" value={`~${tape} ft`} />
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Screws/compound/tape are rough estimates — quantities vary with stud
          spacing and finish level.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}
