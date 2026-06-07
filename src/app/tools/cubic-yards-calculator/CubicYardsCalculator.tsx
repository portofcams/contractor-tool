"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function CubicYardsCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [unit, setUnit] = useState("in"); // depth unit: in | ft

  const L = num(length), W = num(width);
  const depthFt = unit === "in" ? num(depth) / 12 : num(depth);
  const cuft = L * W * depthFt;
  const cuyd = cuft / 27;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Depth</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={depth} onChange={(e) => setDepth(e.target.value)} /></div>
          <div><label className={labelCls}>Depth unit</label>
            <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="in">inches</option>
              <option value="ft">feet</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Works for concrete, soil, mulch, gravel, sand — anything sold by the cubic yard.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Volume</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Cubic yards</div><div className="text-3xl font-bold">{cuyd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</div><div className="text-xs opacity-80">{fmt(cuft)} cubic feet</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Cubic yards = length × width × depth (all in feet) ÷ 27. Add 5–10% waste for most bulk materials.</p>
      </div>
    </div>
  );
}
