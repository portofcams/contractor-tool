"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function PaverCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [pw, setPw] = useState("4");
  const [pl, setPl] = useState("8");
  const [waste, setWaste] = useState(5);

  const area = num(length) * num(width);
  const paverSqft = (num(pw) * num(pl)) / 144;
  const pavers = paverSqft > 0 ? Math.ceil((area * (1 + waste / 100)) / paverSqft) : 0;
  const sandYd = (area * (1 / 12)) / 27; // 1 inch bedding sand
  const baseYd = (area * (4 / 12)) / 27; // 4 inch gravel base

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Patio &amp; paver</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Paver W (in)</label><input type="number" inputMode="decimal" min="0" placeholder="4" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div><label className={labelCls}>Paver L (in)</label><input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={pl} onChange={(e) => setPl(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={5}>5%</option>
              <option value={10}>10% (angles)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Use 10% waste for circular or diagonal patterns with lots of cuts.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Pavers</div><div className="text-3xl font-bold">{pavers.toLocaleString("en-US")}</div><div className="text-xs opacity-80">{paverSqft > 0 ? `${paverSqft.toFixed(2)} sq ft each` : "enter paver size"} (+{waste}% waste)</div></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Gravel base (4&quot;)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{baseYd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Bedding sand (1&quot;)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{sandYd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Driveways need a deeper base (6–12&quot;). Add polymeric sand for the joints.</p>
      </div>
    </div>
  );
}
