"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function StudCalculator() {
  const [length, setLength] = useState("");
  const [spacing, setSpacing] = useState("16");
  const [plates, setPlates] = useState("3");

  const L = num(length);
  const space = num(spacing) || 16;
  const baseStuds = L > 0 ? Math.floor((L * 12) / space) + 1 : 0;
  const studs = Math.ceil(baseStuds * 1.15); // +15% for corners, openings, blocking
  const plateFt = L * num(plates);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall</h2>
        <div><label className={labelCls}>Total wall length (ft)</label>
          <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={(e) => setLength(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Stud spacing</label>
            <select className={inputCls} value={spacing} onChange={(e) => setSpacing(e.target.value)}>
              <option value="16">16&quot; on center</option>
              <option value="24">24&quot; on center</option>
              <option value="12">12&quot; on center</option>
            </select></div>
          <div><label className={labelCls}>Plates</label>
            <select className={inputCls} value={plates} onChange={(e) => setPlates(e.target.value)}>
              <option value="3">3 (single bottom + double top)</option>
              <option value="2">2 (single top &amp; bottom)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Stud count includes ~15% extra for corners, openings, and blocking.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Studs</div>
          <div className="text-3xl font-bold">{studs}</div>
          <div className="text-xs opacity-80">{spacing}&quot; OC + 15% for corners/openings</div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Plate material ({num(plates)} plates)</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(plateFt)} linear ft</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Plates are usually the same dimensional lumber as the studs. Add headers, jacks, and cripples for each opening.
        </p>
      </div>
    </div>
  );
}
