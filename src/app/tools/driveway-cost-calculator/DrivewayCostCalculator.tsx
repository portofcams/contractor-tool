"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function DrivewayCostCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("10");
  const [type, setType] = useState("concrete");
  const [thick, setThick] = useState("4");

  const sqft = num(length) * num(width);
  const thickFt = num(thick) / 12;
  const cuft = sqft * thickFt;
  const cuyd = cuft / 27;

  // Concrete: ~$150/yd³ material + base; asphalt ~$100/ton, ~145 lb/cuft
  const concreteMat = cuyd * 150;
  const asphaltTons = (cuft * 145) / 2000;
  const asphaltMat = asphaltTons * 100;
  const matCost = type === "concrete" ? concreteMat : asphaltMat;
  // Labor ~1.5–2x material, use 1.75x for midpoint estimate
  const totalLow = matCost * 1.4;
  const totalHigh = matCost * 2.2;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Driveway dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="40" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="10" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>
        </div>
        <div>
          <label className={labelCls}>Material</label>
          <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
            <option value="concrete">Concrete</option>
            <option value="asphalt">Asphalt</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Thickness (inches)</label>
          <select className={inputCls} value={thick} onChange={e => setThick(e.target.value)}>
            <option value="4">4 in — standard passenger cars</option>
            <option value="5">5 in — occasional trucks/RVs</option>
            <option value="6">6 in — heavy vehicles</option>
            <option value="3">3 in asphalt — standard 2-layer</option>
          </select>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Estimates use regional average material costs. Get local supplier quotes for accurate pricing.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Cost estimate</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Installed cost range</div>
          <div className="text-3xl font-bold">${Math.round(totalLow / 100) * 100}–${Math.round(totalHigh / 100) * 100}</div>
          <div className="text-xs opacity-80">{fmt(sqft)} sq ft · materials + labor</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Material only (est.)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">${Math.round(matCost)}</span></div>
          {type === "concrete"
            ? <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Concrete (cubic yards)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(cuyd)} yd³</span></div>
            : <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Asphalt (tons)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(asphaltTons)} tons</span></div>}
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Per sq ft (installed)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">${sqft > 0 ? fmt(totalLow / sqft) : "—"}–${sqft > 0 ? fmt(totalHigh / sqft) : "—"}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Ranges are rough estimates only. Prices vary significantly by region and market. Get 3 contractor quotes for accuracy.</p>
      </div>
    </div>
  );
}
