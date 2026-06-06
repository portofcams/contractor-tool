"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function TileCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [tileW, setTileW] = useState("12");
  const [tileH, setTileH] = useState("12");
  const [waste, setWaste] = useState(10);
  const [perBox, setPerBox] = useState("");

  const area = num(length) * num(width);
  const tileSqft = (num(tileW) * num(tileH)) / 144;
  const withWaste = area * (1 + waste / 100);
  const tiles = tileSqft > 0 ? Math.ceil(withWaste / tileSqft) : 0;
  const boxes = num(perBox) > 0 ? Math.ceil(tiles / num(perBox)) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Area &amp; tile</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Tile width (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileW} onChange={(e) => setTileW(e.target.value)} /></div>
          <div><label className={labelCls}>Tile height (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileH} onChange={(e) => setTileH(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10% (recommended)</option>
              <option value={15}>15% (diagonal)</option>
              <option value={20}>20% (herringbone)</option>
            </select></div>
          <div><label className={labelCls}>Tiles per box (optional)</label>
            <input type="number" inputMode="numeric" min="0" placeholder="—" className={inputCls} value={perBox} onChange={(e) => setPerBox(e.target.value)} /></div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-600 dark:text-neutral-400">Area (+{waste}% waste)</span>
          <span className="font-semibold tabular-nums">{fmt(withWaste)} sq ft</span>
        </div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Tiles</div>
          <div className="text-3xl font-bold">{tiles.toLocaleString("en-US")}</div>
          <div className="text-xs opacity-80">{tileSqft > 0 ? `${tileSqft.toFixed(2)} sq ft each` : "enter tile size"}</div>
        </div>
        {boxes > 0 && (
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Boxes</span>
            <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{boxes}</span>
          </div>
        )}
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Buy from one lot. Keep a few spare tiles for future repairs.
        </p>
      </div>
    </div>
  );
}
