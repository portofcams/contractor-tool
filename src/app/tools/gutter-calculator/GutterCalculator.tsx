"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function GutterCalculator() {
  const [eaves, setEaves] = useState("");
  const [spacing, setSpacing] = useState("35");

  const ft = num(eaves);
  const gutterFt = ft * 1.05; // 5% for end laps and miters
  const downspouts = num(spacing) > 0 && ft > 0 ? Math.ceil(ft / num(spacing)) : 0;
  const hangers = ft > 0 ? Math.ceil(ft / 2) : 0; // ~1 hanger every 24 in

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Roof edges</h2>
        <div><label className={labelCls}>Total eave length (ft)</label>
          <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={eaves} onChange={(e) => setEaves(e.target.value)} /></div>
        <div><label className={labelCls}>Downspout every (ft)</label>
          <select className={inputCls} value={spacing} onChange={(e) => setSpacing(e.target.value)}>
            <option value="35">35 ft (typical)</option>
            <option value="30">30 ft</option>
            <option value="40">40 ft</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Eave length is the total run of roof edge that drains into gutters.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Gutter</div><div className="text-3xl font-bold">{fmt(gutterFt)} ft</div><div className="text-xs opacity-80">includes ~5% for laps &amp; miters</div></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Downspouts</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{downspouts}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Hangers (~every 2 ft)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{hangers}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add end caps, inside/outside corners, and elbows per downspout. Size downspouts up for large or steep roofs.</p>
      </div>
    </div>
  );
}
