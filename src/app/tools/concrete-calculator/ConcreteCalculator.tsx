"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function ConcreteCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("4");
  const [waste, setWaste] = useState(10);

  const L = num(length), W = num(width), T = num(thickness);
  const cuft = L * W * (T / 12);
  const withWaste = cuft * (1 + waste / 100);
  const cuyd = withWaste / 27;
  const bags60 = Math.ceil(withWaste / 0.45);
  const bags80 = Math.ceil(withWaste / 0.6);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Slab dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Thickness (inches)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="4" className={inputCls} value={thickness} onChange={(e) => setThickness(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10% (recommended)</option>
              <option value={15}>15%</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          A 4&quot; slab is typical for patios and walkways; 5–6&quot; for driveways.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Ready-mix concrete (+{waste}% waste)</div>
          <div className="text-3xl font-bold">{cuyd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</div>
          <div className="text-xs opacity-80">{fmt(withWaste)} cubic feet</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="If bagging it: 60 lb bags" value={`${bags60.toLocaleString("en-US")}`} />
          <Row label="If bagging it: 80 lb bags" value={`${bags80.toLocaleString("en-US")}`} />
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Order ready-mix by the cubic yard for slabs over ~1 yd³. Bags (60 lb ≈
          0.45 ft³, 80 lb ≈ 0.6 ft³) suit small pours and post holes.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}
