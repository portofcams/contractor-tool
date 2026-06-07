"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function DropCeilingCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [tile, setTile] = useState("8"); // 2x4 = 8 sq ft, 2x2 = 4 sq ft

  const L = num(length), W = num(width);
  const area = L * W;
  const tileSqft = num(tile) || 8;
  const tiles = tileSqft > 0 ? Math.ceil(area / tileSqft) : 0;
  const wallAngle = 2 * (L + W); // perimeter, linear ft
  // Main tees run the length every 4 ft; cross tees fill the grid.
  const mainTees = L > 0 && W > 0 ? Math.ceil(W / 4) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Ceiling</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Tile size</label>
          <select className={inputCls} value={tile} onChange={(e) => setTile(e.target.value)}>
            <option value="8">2 × 4 ft (8 sq ft)</option>
            <option value="4">2 × 2 ft (4 sq ft)</option>
          </select></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">For a suspended (drop) ceiling grid. Wall angle runs the room perimeter.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Ceiling area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Ceiling tiles</div><div className="text-3xl font-bold">{tiles.toLocaleString("en-US")}</div><div className="text-xs opacity-80">{tileSqft} sq ft each</div></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Wall angle (perimeter)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(wallAngle)} ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Main tees (12 ft, approx)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{mainTees}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add 4-ft and 2-ft cross tees to fill the grid, plus hanger wire every 4 ft. Order a few extra tiles for cuts.</p>
      </div>
    </div>
  );
}
