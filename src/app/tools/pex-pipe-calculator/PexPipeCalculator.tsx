"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function PexPipeCalculator() {
  const [area, setArea] = useState("");
  const [spacing, setSpacing] = useState("9");
  const [manifoldDist, setManifoldDist] = useState("10");

  const sqft = num(area);
  const spacingFt = num(spacing) / 12;
  const loopFt = spacingFt > 0 ? sqft / spacingFt : 0;
  const withWaste = loopFt * 1.2 + num(manifoldDist) * 2; // +20% waste + round trip to manifold
  const loops = withWaste > 0 ? Math.ceil(withWaste / 300) : 0; // max 300 ft per loop

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Room &amp; loop details</h2>
        <div><label className={labelCls}>Room area (sq ft)</label><input type="number" inputMode="decimal" min="0" placeholder="200" className={inputCls} value={area} onChange={e => setArea(e.target.value)} /></div>
        <div>
          <label className={labelCls}>Loop spacing (inches)</label>
          <select className={inputCls} value={spacing} onChange={e => setSpacing(e.target.value)}>
            <option value="6">6 in — high heat loss (garage, cold slab)</option>
            <option value="9">9 in — standard residential</option>
            <option value="12">12 in — well-insulated, mild climate</option>
          </select>
        </div>
        <div><label className={labelCls}>Distance to manifold (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="10" className={inputCls} value={manifoldDist} onChange={e => setManifoldDist(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Includes 20% waste + round-trip manifold run. Keep each loop under 300 ft for even heat distribution.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Total PEX footage</div>
          <div className="text-3xl font-bold">{Math.ceil(withWaste).toLocaleString()} ft</div>
          <div className="text-xs opacity-80">includes 20% waste + manifold runs</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Loop footage (net)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{Math.ceil(loopFt)} ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Loops needed (≤300 ft ea)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{loops}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">100-ft coil count</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{Math.ceil(withWaste / 100)}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Use 1/2-in PEX for loops under 300 ft. Split larger rooms across multiple loops from a manifold.</p>
      </div>
    </div>
  );
}
