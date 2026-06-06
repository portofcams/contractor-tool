"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function BaseboardCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [doors, setDoors] = useState("1");
  const [doorWidth, setDoorWidth] = useState("3");
  const [stock, setStock] = useState("16");
  const [waste, setWaste] = useState(10);

  const perimeter = 2 * (num(length) + num(width));
  const net = Math.max(0, perimeter - num(doors) * num(doorWidth));
  const withWaste = net * (1 + waste / 100);
  const stockLen = num(stock) || 16;
  const pieces = stockLen > 0 ? Math.ceil(withWaste / stockLen) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Room</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Doorways</label>
            <input type="number" inputMode="numeric" min="0" placeholder="1" className={inputCls} value={doors} onChange={(e) => setDoors(e.target.value)} /></div>
          <div><label className={labelCls}>Doorway width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="3" className={inputCls} value={doorWidth} onChange={(e) => setDoorWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Stock length (ft)</label>
            <select className={inputCls} value={stock} onChange={(e) => setStock(e.target.value)}>
              <option value="16">16 ft</option>
              <option value="12">12 ft</option>
              <option value="8">8 ft</option>
            </select></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10% (recommended)</option>
              <option value={15}>15% (many corners)</option>
            </select></div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Room perimeter</span><span className="font-semibold tabular-nums">{fmt(perimeter)} ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Trim run (+{waste}% waste)</span><span className="font-semibold tabular-nums">{fmt(withWaste)} ft</span></div>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Pieces ({stockLen} ft each)</div>
          <div className="text-3xl font-bold">{pieces}</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Applies to baseboard, crown, shoe, and chair rail. Buy a spare stick for miter mistakes.
        </p>
      </div>
    </div>
  );
}
