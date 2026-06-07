"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function PoolVolumeCalculator() {
  const [shape, setShape] = useState("rect");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [avgDepth, setAvgDepth] = useState("");

  const L = num(length), W = num(width), D = num(avgDepth);
  // Rectangular: L × W × D × 7.48 gal/cuft
  // Oval: L × W × 0.785 × D × 7.48
  // Round: π × (L/2)² × D × 7.48 (L = diameter)
  const cuft = shape === "rect" ? L * W * D
    : shape === "oval" ? L * W * 0.785 * D
    : Math.PI * Math.pow(L / 2, 2) * D;
  const gallons = cuft * 7.48;
  const lbs_chlorine = gallons / 10000 * 1; // rough: 1lb chlorine per 10k gallons

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Pool</h2>
        <div><label className={labelCls}>Shape</label>
          <select className={inputCls} value={shape} onChange={e => setShape(e.target.value)}>
            <option value="rect">Rectangular</option>
            <option value="oval">Oval</option>
            <option value="round">Round / circular</option>
          </select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>{shape === "round" ? "Diameter (ft)" : "Length (ft)"}</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          {shape !== "round" && <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>}
        </div>
        <div><label className={labelCls}>Average depth (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="e.g. 4.5" className={inputCls} value={avgDepth} onChange={e => setAvgDepth(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Average depth = (shallow end depth + deep end depth) ÷ 2.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Pool volume</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Volume</div>
          <div className="text-3xl font-bold">{gallons.toLocaleString("en-US", { maximumFractionDigits: 0 })} gal</div>
          <div className="text-xs opacity-80">{fmt(cuft)} cubic feet</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Chlorine shock (~1 lb / 10k gal)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">~{lbs_chlorine.toLocaleString("en-US", { maximumFractionDigits: 1 })} lb</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Knowing your volume is essential for correct chemical dosing. Always test water before treating.</p>
      </div>
    </div>
  );
}
