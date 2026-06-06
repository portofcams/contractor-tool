"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function RetainingWallCalculator() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [blockW, setBlockW] = useState("12");
  const [blockH, setBlockH] = useState("6");
  const [waste, setWaste] = useState(5);

  const L = num(length), H = num(height);
  const rows = num(blockH) > 0 && H > 0 ? Math.ceil((H * 12) / num(blockH)) : 0;
  const perRow = num(blockW) > 0 && L > 0 ? Math.ceil((L * 12) / num(blockW)) : 0;
  const total = Math.ceil(rows * perRow * (1 + waste / 100));
  const caps = perRow;
  const baseYd = (L * 0.75 * (6 / 12)) / 27; // ~9in wide x 6in deep gravel base trench

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall &amp; block</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Wall length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Wall height (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Block W (in)</label><input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={blockW} onChange={(e) => setBlockW(e.target.value)} /></div>
          <div><label className={labelCls}>Block H (in)</label><input type="number" inputMode="decimal" min="0" placeholder="6" className={inputCls} value={blockH} onChange={(e) => setBlockH(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10% (curves)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Walls over ~3–4 ft usually need engineering, geogrid, and a permit.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Courses (rows)</span><span className="font-semibold tabular-nums">{rows}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Blocks per row</span><span className="font-semibold tabular-nums">{perRow}</span></div>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Wall blocks</div><div className="text-3xl font-bold">{total.toLocaleString("en-US")}</div><div className="text-xs opacity-80">+{waste}% waste</div></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Cap blocks (top row)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{caps}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Gravel base (approx)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{baseYd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add drainage gravel and pipe behind the wall and a compacted leveling base below the first course.</p>
      </div>
    </div>
  );
}
