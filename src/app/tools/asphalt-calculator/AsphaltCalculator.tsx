"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function AsphaltCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("3");

  const area = num(length) * num(width);
  const cuft = area * (num(thickness) / 12);
  const tons = (cuft * 145) / 2000; // hot-mix asphalt ~145 lb/cu ft compacted

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Paving area</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Compacted thickness (inches)</label>
          <input type="number" inputMode="decimal" min="0" placeholder="3" className={inputCls} value={thickness} onChange={(e) => setThickness(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Residential driveways are typically 2–3&quot; of asphalt over a compacted aggregate base.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Hot-mix asphalt</div><div className="text-3xl font-bold">{tons.toLocaleString("en-US", { maximumFractionDigits: 1 })} tons</div><div className="text-xs opacity-80">{fmt(cuft)} cubic feet compacted</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Based on ~145 lb per cubic foot of compacted hot mix. Mix density varies — confirm with your plant, and order a little extra.</p>
      </div>
    </div>
  );
}
