"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function DeckCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [boardWidth, setBoardWidth] = useState("5.5");
  const [boardLength, setBoardLength] = useState("16");
  const [gap, setGap] = useState("0.125");
  const [waste, setWaste] = useState(10);

  const area = num(length) * num(width);
  const coverW = (num(boardWidth) + num(gap)) / 12;
  const coverPer = coverW * num(boardLength);
  const withWaste = area * (1 + waste / 100);
  const boards = coverPer > 0 ? Math.ceil(withWaste / coverPer) : 0;
  const linft = boards * num(boardLength);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Deck &amp; boards</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Deck length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Deck width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Board width (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="5.5" className={inputCls} value={boardWidth} onChange={(e) => setBoardWidth(e.target.value)} /></div>
          <div><label className={labelCls}>Board length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="16" className={inputCls} value={boardLength} onChange={(e) => setBoardLength(e.target.value)} /></div>
          <div><label className={labelCls}>Gap (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0.125" className={inputCls} value={gap} onChange={(e) => setGap(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Waste</label>
          <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
            <option value={10}>10% (straight)</option>
            <option value={15}>15% (diagonal / picture frame)</option>
          </select></div>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-600 dark:text-neutral-400">Deck area</span>
          <span className="font-semibold tabular-nums">{fmt(area)} sq ft</span>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Deck boards ({num(boardLength) || "?"} ft)</div>
          <div className="text-3xl font-bold">{boards.toLocaleString("en-US")}</div>
          <div className="text-xs opacity-80">{fmt(linft)} total linear feet</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Boards run perpendicular to the joists. Add joists, beams, and fasteners separately (~350 screws per 100 sq ft).
        </p>
      </div>
    </div>
  );
}
