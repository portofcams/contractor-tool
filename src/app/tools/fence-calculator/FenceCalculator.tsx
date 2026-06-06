"use client";

import { useState } from "react";
import { inputCls, labelCls, num } from "../_components/calc-ui";

export default function FenceCalculator() {
  const [length, setLength] = useState("");
  const [spacing, setSpacing] = useState("8");
  const [rails, setRails] = useState("3");
  const [picketW, setPicketW] = useState("5.5");
  const [gap, setGap] = useState("0");

  const L = num(length);
  const space = num(spacing) || 8;
  const sections = space > 0 && L > 0 ? Math.ceil(L / space) : 0;
  const posts = sections > 0 ? sections + 1 : 0;
  const railsTotal = sections * num(rails);
  const picketCover = num(picketW) + num(gap);
  const pickets = picketCover > 0 && L > 0 ? Math.ceil((L * 12) / picketCover) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Fence line</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Total length (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Post spacing (ft)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={spacing} onChange={(e) => setSpacing(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Rails per section</label>
          <select className={inputCls} value={rails} onChange={(e) => setRails(e.target.value)}>
            <option value="2">2 (under ~5 ft tall)</option>
            <option value="3">3 (6 ft privacy)</option>
          </select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Picket width (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="5.5" className={inputCls} value={picketW} onChange={(e) => setPicketW(e.target.value)} /></div>
          <div><label className={labelCls}>Gap between (in)</label>
            <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={gap} onChange={(e) => setGap(e.target.value)} /></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Set the gap to 0 for a solid privacy fence, or a positive value for a spaced picket look.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Posts</div>
          <div className="text-3xl font-bold">{posts}</div>
          <div className="text-xs opacity-80">{sections} sections at {space} ft</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Rails</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{railsTotal}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Pickets / boards</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{pickets.toLocaleString("en-US")}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Add an extra post and concrete bag per gate. Posts use ~1–2 bags of concrete each.
        </p>
      </div>
    </div>
  );
}
