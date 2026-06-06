"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function MulchCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("3");
  const [bagSize, setBagSize] = useState("2");

  const area = num(length) * num(width);
  const cuft = area * (num(depth) / 12);
  const cuyd = cuft / 27;
  const bag = num(bagSize) || 2;
  const bags = bag > 0 ? Math.ceil(cuft / bag) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Bed area</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Depth (inches)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="3" className={inputCls} value={depth} onChange={(e) => setDepth(e.target.value)} /></div>
          <div><label className={labelCls}>Bag size (cu ft)</label>
            <select className={inputCls} value={bagSize} onChange={(e) => setBagSize(e.target.value)}>
              <option value="2">2 cu ft (mulch)</option>
              <option value="1.5">1.5 cu ft</option>
              <option value="0.75">0.75 cu ft (soil)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Typical depths: 2–3&quot; for mulch top-up, 3–4&quot; for a new bed, 1–2&quot; for gravel leveling.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Bulk material</div>
          <div className="text-3xl font-bold">{cuyd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</div>
          <div className="text-xs opacity-80">{fmt(cuft)} cubic feet</div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Or bags ({bag} cu ft each)</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{bags}</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Works for mulch, topsoil, compost, and gravel. Order bulk by the yard for big beds — it&apos;s far cheaper than bags.
        </p>
      </div>
    </div>
  );
}
