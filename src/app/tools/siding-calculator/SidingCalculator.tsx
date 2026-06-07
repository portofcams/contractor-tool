"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function SidingCalculator() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("4");
  const [waste, setWaste] = useState(10);

  const gross = num(length) * num(height);
  const net = Math.max(0, gross - num(doors) * 21 - num(windows) * 15);
  const withWaste = net * (1 + waste / 100);
  const squares = withWaste / 100;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Walls</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Total wall length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Wall height (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Doors</label><input type="number" inputMode="numeric" min="0" className={inputCls} value={doors} onChange={(e) => setDoors(e.target.value)} /></div>
          <div><label className={labelCls}>Windows</label><input type="number" inputMode="numeric" min="0" className={inputCls} value={windows} onChange={(e) => setWindows(e.target.value)} /></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10%</option>
              <option value={15}>15% (lots of cuts)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Total wall length is the perimeter of the walls being sided. Siding is sold by the square (100 sq ft).</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Net wall area (+{waste}% waste)</span><span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Siding</div><div className="text-3xl font-bold">{squares.toLocaleString("en-US", { maximumFractionDigits: 1 })} squares</div><div className="text-xs opacity-80">1 square = 100 sq ft</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add trim, corner posts, J-channel, and starter strip by linear foot. Order extra for gables and complex elevations.</p>
      </div>
    </div>
  );
}
