"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function SodCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [waste, setWaste] = useState(5);

  const area = num(length) * num(width);
  const withWaste = area * (1 + waste / 100);
  const sqYd = withWaste / 9;
  const pallets = Math.ceil(withWaste / 450); // ~450 sq ft per pallet

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Lawn area</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Waste</label>
          <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
            <option value={5}>5% (rectangular)</option>
            <option value={10}>10% (curves / cuts)</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          For an irregular yard, break it into rectangles and add them up.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Sod (+{waste}% waste)</div>
          <div className="text-3xl font-bold">{fmt(withWaste)} sq ft</div>
          <div className="text-xs opacity-80">{fmt(sqYd)} square yards</div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Pallets (~450 sq ft each)</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{pallets}</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Pallet coverage varies (~400–500 sq ft) by farm and slab size — confirm with your supplier. Lay sod the day it's delivered.
        </p>
      </div>
    </div>
  );
}
