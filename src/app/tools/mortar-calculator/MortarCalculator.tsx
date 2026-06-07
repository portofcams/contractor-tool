"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function MortarCalculator() {
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("brick");

  const sqft = num(area);
  // Coverage per 60 lb bag: brick ~7.5 sqft, block ~13 sqft
  const coverage = unit === "brick" ? 7.5 : 13;
  const bags = sqft > 0 ? Math.ceil((sqft / coverage) * 1.1) : 0; // +10% waste
  const brickCount = unit === "brick" ? Math.round(sqft * 6.75) : Math.round(sqft * 1.125); // ~6.75 std bricks/sqft, ~1.125 blocks/sqft

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall details</h2>
        <div><label className={labelCls}>Wall area (sq ft)</label><input type="number" inputMode="decimal" min="0" placeholder="100" className={inputCls} value={area} onChange={e => setArea(e.target.value)} /></div>
        <div>
          <label className={labelCls}>Masonry unit</label>
          <select className={inputCls} value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="brick">Standard brick (3⅝ × 2¼ × 7⅝ in, 3/8-in joints)</option>
            <option value="block">CMU block (8 × 8 × 16 in, 3/8-in joints)</option>
          </select>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Coverage assumes 3/8-in mortar joints and Type S or Type N premix bags. Includes 10% waste.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">60 lb mortar bags</div>
          <div className="text-3xl font-bold">{bags}</div>
          <div className="text-xs opacity-80">includes 10% waste</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Wall area</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(sqft)} sq ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Est. {unit === "brick" ? "bricks" : "blocks"}</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{brickCount.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Coverage per bag</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">~{coverage} sq ft</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Mix to peanut-butter consistency. Use Type S for below-grade or wet areas, Type N for above-grade interior/exterior.</p>
      </div>
    </div>
  );
}
