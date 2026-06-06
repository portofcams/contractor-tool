"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function PlywoodCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [sheet, setSheet] = useState("32");
  const [waste, setWaste] = useState(10);

  const area = num(length) * num(width);
  const withWaste = area * (1 + waste / 100);
  const sheetSqft = num(sheet) || 32;
  const sheets = sheetSqft > 0 ? Math.ceil(withWaste / sheetSqft) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Surface</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Sheet size</label>
            <select className={inputCls} value={sheet} onChange={(e) => setSheet(e.target.value)}>
              <option value="32">4 × 8 ft (32 sq ft)</option>
              <option value="40">4 × 10 ft (40 sq ft)</option>
            </select></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10% (recommended)</option>
              <option value={15}>15% (cut-up areas)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Works for plywood, OSB, subfloor, and roof or wall sheathing.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-600 dark:text-neutral-400">Area (+{waste}% waste)</span>
          <span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Sheets</div>
          <div className="text-3xl font-bold">{sheets}</div>
          <div className="text-xs opacity-80">{sheetSqft} sq ft each</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Stagger seams and leave a 1/8&quot; gap between sheets for expansion. Round up to whole sheets.
        </p>
      </div>
    </div>
  );
}
