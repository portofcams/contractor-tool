"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function WindowCalculator() {
  const [wallLen, setWallLen] = useState("");
  const [winW, setWinW] = useState("36");
  const [winH, setWinH] = useState("48");
  const [spacing, setSpacing] = useState("18");

  const wW = num(winW);
  const wH = num(winH);
  const gap = num(spacing);
  const wallFt = num(wallLen);

  // Window count: how many fit given wall length, window width (in), gap between windows
  const slotWidth = (wW + gap) / 12; // ft per window slot
  const count = wallFt > 0 && slotWidth > 0 ? Math.floor((wallFt + gap / 12) / slotWidth) : 0;
  const glassArea = count * (wW / 12) * (wH / 12);
  const roW = wW + 2;
  const roH = wH + 2;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall &amp; window dimensions</h2>
        <div><label className={labelCls}>Wall length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="20" className={inputCls} value={wallLen} onChange={e => setWallLen(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Window width (in)</label><input type="number" inputMode="decimal" min="0" placeholder="36" className={inputCls} value={winW} onChange={e => setWinW(e.target.value)} /></div>
          <div><label className={labelCls}>Window height (in)</label><input type="number" inputMode="decimal" min="0" placeholder="48" className={inputCls} value={winH} onChange={e => setWinH(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Gap between windows (in)</label><input type="number" inputMode="decimal" min="0" placeholder="18" className={inputCls} value={spacing} onChange={e => setSpacing(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Rough opening = window unit + 2 in each direction (standard framing allowance).</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Results</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Windows that fit</div>
          <div className="text-3xl font-bold">{count}</div>
          <div className="text-xs opacity-80">{fmt(glassArea)} sq ft total glass area</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Rough opening (W × H)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{roW}&quot; × {roH}&quot;</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Per window glass area</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt((wW / 12) * (wH / 12))} sq ft</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Total rough opening area</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(count * (roW / 12) * (roH / 12))} sq ft</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Verify rough opening with the window manufacturer spec sheet before framing.</p>
      </div>
    </div>
  );
}
