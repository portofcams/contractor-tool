"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function GravelCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("3");
  const [waste, setWaste] = useState(5);

  const area = num(length) * num(width);
  const cuft = area * (num(depth) / 12) * (1 + waste / 100);
  const cuyd = cuft / 27;
  const tons = cuyd * 1.4; // ~1.4 tons per cubic yard for gravel

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Area</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Depth (inches)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="3" className={inputCls} value={depth} onChange={(e) => setDepth(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Driveways: 4–6&quot; total over base. Paths: 2–3&quot;. Drainage: 3–4&quot;.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Gravel</div>
          <div className="text-3xl font-bold">{cuyd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</div>
          <div className="text-xs opacity-80">{fmt(cuft)} cubic feet</div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Weight (approx)</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{tons.toLocaleString("en-US", { maximumFractionDigits: 1 })} tons</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Gravel weighs roughly 1.4 tons per cubic yard (varies by stone). Order by the yard or ton from the quarry.
        </p>
      </div>
    </div>
  );
}
