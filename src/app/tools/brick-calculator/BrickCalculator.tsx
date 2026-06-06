"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function BrickCalculator() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("brick"); // brick | block
  const [waste, setWaste] = useState(10);

  const area = num(length) * num(height);
  const perSqft = unit === "brick" ? 7 : 1.125; // modular brick ~7/sqft; 8x8x16 CMU ~1.125/sqft
  const units = Math.ceil(area * perSqft * (1 + waste / 100));
  const mortarBags = unit === "brick" ? Math.ceil(units / 125) : Math.ceil(units / 33);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Height (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Unit</label>
            <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="brick">Modular brick (~7/sq ft)</option>
              <option value="block">8×8×16 block (~1.1/sq ft)</option>
            </select></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10% (recommended)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Counts include the mortar joint. Deduct large openings from length × height first.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Wall area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">{unit === "brick" ? "Bricks" : "Blocks"}</div><div className="text-3xl font-bold">{units.toLocaleString("en-US")}</div><div className="text-xs opacity-80">~{perSqft}/sq ft (+{waste}% waste)</div></div>
        <div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Mortar (80 lb bags, approx)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{mortarBags}</span></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Mortar is a rough estimate (~1 bag per 125 brick or 33 block) and varies with joint size. Add sand if mixing from type-S.</p>
      </div>
    </div>
  );
}
