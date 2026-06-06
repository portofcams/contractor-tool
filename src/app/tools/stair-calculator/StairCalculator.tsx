"use client";

import { useState } from "react";
import { inputCls, labelCls, num } from "../_components/calc-ui";

export default function StairCalculator() {
  const [rise, setRise] = useState("");
  const [tread, setTread] = useState("10.5");

  const totalRise = num(rise);
  const risers = totalRise > 0 ? Math.max(1, Math.round(totalRise / 7.5)) : 0;
  const riserH = risers > 0 ? totalRise / risers : 0;
  const treads = Math.max(0, risers - 1);
  const treadD = num(tread) || 10.5;
  const totalRun = treads * treadD;
  const riserOk = riserH > 0 && riserH <= 7.75;
  const treadOk = treadD >= 10;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Stair run</h2>
        <div><label className={labelCls}>Total rise — floor to floor (inches)</label>
          <input type="number" inputMode="decimal" min="0" placeholder="e.g. 108" className={inputCls} value={rise} onChange={(e) => setRise(e.target.value)} /></div>
        <div><label className={labelCls}>Tread depth (inches)</label>
          <input type="number" inputMode="decimal" min="0" placeholder="10.5" className={inputCls} value={tread} onChange={(e) => setTread(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Measure the total vertical height between finished floors. Common residential code: riser ≤ 7-3/4&quot;, tread ≥ 10&quot;.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Your stairs</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Steps (risers)</div><div className="text-3xl font-bold">{risers}</div><div className="text-xs opacity-80">{treads} treads</div></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Riser height</span><span className={`font-semibold tabular-nums ${riserH > 0 && !riserOk ? "text-red-500" : "text-neutral-900 dark:text-neutral-100"}`}>{riserH.toFixed(2)} in{riserH > 0 && !riserOk ? " ⚠" : ""}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Total run (horizontal)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{totalRun.toFixed(1)} in ({(totalRun / 12).toFixed(1)} ft)</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">{riserH > 0 && !riserOk ? "Riser exceeds the typical 7-3/4\" limit — add a step." : treadOk ? "Within common residential limits — always confirm local code." : "Tread is below the typical 10\" minimum."}</p>
      </div>
    </div>
  );
}
