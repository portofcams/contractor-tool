"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

const PITCH = [
  { label: "Flat / low (2–3 in 12)", f: 1.03 },
  { label: "Medium (4–6 in 12)", f: 1.12 },
  { label: "Steep (7–9 in 12)", f: 1.25 },
  { label: "Very steep (10–12 in 12)", f: 1.42 },
];

export default function RoofingCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [pitch, setPitch] = useState(1.12);
  const [waste, setWaste] = useState(10);

  const footprint = num(length) * num(width);
  const roofArea = footprint * pitch;
  const withWaste = roofArea * (1 + waste / 100);
  const squares = withWaste / 100;
  const bundles = Math.ceil(squares * 3);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Roof</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Footprint length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Footprint width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Roof pitch</label>
          <select className={inputCls} value={pitch} onChange={(e) => setPitch(Number(e.target.value))}>
            {PITCH.map((p) => (<option key={p.f} value={p.f}>{p.label}</option>))}
          </select></div>
        <div><label className={labelCls}>Waste</label>
          <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
            <option value={10}>10% (simple gable)</option>
            <option value={15}>15% (hips & valleys)</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Footprint is the ground area the roof covers; pitch scales it up to the actual sloped area.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Roof area</span><span className="font-semibold tabular-nums">{fmt(roofArea)} sq ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">With {waste}% waste</span><span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span></div>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Roofing squares</div>
          <div className="text-3xl font-bold">{squares.toLocaleString("en-US", { maximumFractionDigits: 1 })}</div>
          <div className="text-xs opacity-80">1 square = 100 sq ft</div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Shingle bundles (3 / square)</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{bundles}</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Architectural shingles run ~3 bundles per square. Add starter strip, ridge cap, and underlayment separately.
        </p>
      </div>
    </div>
  );
}
