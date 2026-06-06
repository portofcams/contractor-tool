"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function RebarCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [spacing, setSpacing] = useState("12");
  const [barLen, setBarLen] = useState("20");

  const L = num(length), W = num(width), s = num(spacing);
  // Bars running the length L, counted across the width W; and vice-versa.
  const barsAlongL = s > 0 && W > 0 ? Math.floor((W * 12) / s) + 1 : 0;
  const barsAlongW = s > 0 && L > 0 ? Math.floor((L * 12) / s) + 1 : 0;
  const linFt = barsAlongL * L + barsAlongW * W;
  const stock = num(barLen) || 20;
  const bars = stock > 0 ? Math.ceil(linFt / stock) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Slab &amp; grid</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Grid spacing (in)</label>
            <select className={inputCls} value={spacing} onChange={(e) => setSpacing(e.target.value)}>
              <option value="12">12&quot; on center</option>
              <option value="16">16&quot; on center</option>
              <option value="18">18&quot; on center</option>
              <option value="24">24&quot; on center</option>
            </select></div>
          <div><label className={labelCls}>Bar length (ft)</label>
            <select className={inputCls} value={barLen} onChange={(e) => setBarLen(e.target.value)}>
              <option value="20">20 ft</option>
              <option value="10">10 ft</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Assumes a two-way grid. Add ~10–15% for laps and overlap on long runs.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Bars across width</span><span className="font-semibold tabular-nums">{barsAlongL}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Bars across length</span><span className="font-semibold tabular-nums">{barsAlongW}</span></div>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Total rebar</div><div className="text-3xl font-bold">{fmt(linFt)} ft</div><div className="text-xs opacity-80">{bars} × {stock} ft bars</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add tie wire and chairs/dobies. Lap splices add length — order ~10% extra on big pours.</p>
      </div>
    </div>
  );
}
