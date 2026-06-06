"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function WallpaperCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("8");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("2");
  const [usable, setUsable] = useState("25");
  const [waste, setWaste] = useState(15);

  const L = num(length), W = num(width), H = num(height);
  const wallArea = Math.max(0, 2 * (L + W) * H - num(doors) * 21 - num(windows) * 15);
  const per = num(usable) || 25;
  const rolls = per > 0 ? Math.ceil((wallArea * (1 + waste / 100)) / per) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Room</h2>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} /></div>
          <div><label className={labelCls}>Height (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Doors</label><input type="number" inputMode="numeric" min="0" className={inputCls} value={doors} onChange={(e) => setDoors(e.target.value)} /></div>
          <div><label className={labelCls}>Windows</label><input type="number" inputMode="numeric" min="0" className={inputCls} value={windows} onChange={(e) => setWindows(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Usable sq ft / roll</label><input type="number" inputMode="decimal" min="0" placeholder="25" className={inputCls} value={usable} onChange={(e) => setUsable(e.target.value)} /></div>
          <div><label className={labelCls}>Waste (pattern)</label>
            <select className={inputCls} value={waste} onChange={(e) => setWaste(Number(e.target.value))}>
              <option value={10}>10% (no repeat)</option>
              <option value={15}>15% (small repeat)</option>
              <option value={20}>20% (large repeat)</option>
            </select></div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Wall area</span><span className="font-semibold tabular-nums">{fmt(wallArea)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white"><div className="text-sm opacity-90">Wallpaper rolls</div><div className="text-3xl font-bold">{rolls}</div><div className="text-xs opacity-80">at {per} usable sq ft each (+{waste}% waste)</div></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">A standard roll holds ~56 sq ft but only ~25 is usable after matching a pattern. Larger repeats waste more — buy one extra roll from the same batch.</p>
      </div>
    </div>
  );
}
