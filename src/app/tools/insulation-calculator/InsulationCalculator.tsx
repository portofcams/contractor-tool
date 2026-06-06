"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function InsulationCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [coverage, setCoverage] = useState("40");
  const [waste, setWaste] = useState(5);

  const area = num(length) * num(width);
  const withWaste = area * (1 + waste / 100);
  const cov = num(coverage) || 40;
  const bags = cov > 0 ? Math.ceil(withWaste / cov) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Area to insulate</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Coverage per bag/roll (sq ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="40" className={inputCls} value={coverage} onChange={(e) => setCoverage(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Coverage is on the bag/roll for your target R-value (blown-in coverage drops as R-value rises).
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-600 dark:text-neutral-400">Area (+{waste}% waste)</span>
          <span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Bags / rolls</div>
          <div className="text-3xl font-bold">{bags}</div>
          <div className="text-xs opacity-80">at {cov} sq ft each</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          For batts, divide your area by the square feet per bundle. For blown-in, use the coverage chart on the bag for your R-value.
        </p>
      </div>
    </div>
  );
}
