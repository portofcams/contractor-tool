"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function SprayFoamCalculator() {
  const [area, setArea] = useState("");
  const [thickness, setThickness] = useState("3");
  const [type, setType] = useState("closed");

  // bf per can: 2lb closed-cell ≈ 200 bf per kit (2-component), 1/2lb open-cell ≈ 1,000 bf
  // DIY cans: ~12-15 bf per can for gap-filling foam; for insulation kits: 600bf kit, 200bf kit
  const targetBF = num(area) * num(thickness);
  const kits600 = Math.ceil(targetBF / 600);
  const kits200 = Math.ceil(targetBF / 200);
  const rValue = type === "closed" ? num(thickness) * 6.5 : num(thickness) * 3.8;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Insulation job</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Area to spray (sq ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={area} onChange={e => setArea(e.target.value)} /></div>
          <div><label className={labelCls}>Thickness (inches)</label><input type="number" inputMode="decimal" min="0" placeholder="3" className={inputCls} value={thickness} onChange={e => setThickness(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Foam type</label>
          <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
            <option value="closed">Closed-cell (R-6.5/in, ~200 bf/kit)</option>
            <option value="open">Open-cell (R-3.8/in, ~600 bf/kit)</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Board feet (bf) = sq ft × inches of thickness. Two-component foam kits are measured in board feet.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Board feet needed</span><span className="font-semibold tabular-nums">{fmt(targetBF)} bf</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">2-component kits</div>
          <div className="text-3xl font-bold">{type === "closed" ? kits200 : kits600}</div>
          <div className="text-xs opacity-80">{type === "closed" ? "200 bf" : "600 bf"} per kit</div>
        </div>
        <div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Approximate R-value</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">R-{rValue.toFixed(0)}</span></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Kit yields vary by temperature and technique. Buy 10–15% extra. Wear PPE — spray foam is an irritant before it cures.</p>
      </div>
    </div>
  );
}
