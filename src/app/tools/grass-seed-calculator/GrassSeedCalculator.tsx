"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function GrassSeedCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [rate, setRate] = useState("5");

  const area = num(length) * num(width);
  const lbs = (area / 1000) * num(rate);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Lawn</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Seeding rate</label>
          <select className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)}>
            <option value="5">New lawn — 5 lb / 1,000 sq ft</option>
            <option value="3">Overseed — 3 lb / 1,000 sq ft</option>
            <option value="8">Heavy / fast cover — 8 lb / 1,000 sq ft</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Rates vary by grass type — check the bag for the exact recommendation.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Lawn area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Grass seed</div><div className="text-3xl font-bold">{lbs.toLocaleString("en-US", { maximumFractionDigits: 1 })} lb</div><div className="text-xs opacity-80">at {rate} lb / 1,000 sq ft</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Pair with a starter fertilizer and straw or seed blanket for slopes. Keep new seed consistently moist until established.</p>
      </div>
    </div>
  );
}
