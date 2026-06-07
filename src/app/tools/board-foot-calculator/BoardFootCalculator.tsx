"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function BoardFootCalculator() {
  const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");

  const bfEach = (num(thickness) * num(width) * num(length)) / 12; // T(in) x W(in) x L(ft) / 12
  const total = bfEach * num(qty);
  const cost = total * num(price);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Lumber</h2>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Thickness (in)</label><input type="number" inputMode="decimal" min="0" placeholder="2" className={inputCls} value={thickness} onChange={(e) => setThickness(e.target.value)} /></div>
          <div><label className={labelCls}>Width (in)</label><input type="number" inputMode="decimal" min="0" placeholder="6" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Quantity</label><input type="number" inputMode="numeric" min="0" placeholder="1" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} /></div>
          <div><label className={labelCls}>Price / board foot ($)</label><input type="number" inputMode="decimal" min="0" placeholder="—" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Use nominal thickness/width (a 2×6 is 2 × 6). One board foot = 144 cubic inches.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Result</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Per piece</span><span className="font-semibold tabular-nums">{fmt(bfEach)} bd ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Total board feet</div><div className="text-3xl font-bold">{fmt(total)}</div><div className="text-xs opacity-80">{num(qty) || 0} pieces</div></div>
        {num(price) > 0 && (<div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Estimated cost</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">${cost.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span></div>)}
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Board feet = (thickness × width × length-in-feet) ÷ 12. Hardwood is usually priced per board foot.</p>
      </div>
    </div>
  );
}
