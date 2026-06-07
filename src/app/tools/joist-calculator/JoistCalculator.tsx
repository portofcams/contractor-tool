"use client";
import { useState } from "react";
import { inputCls, labelCls, num } from "../_components/calc-ui";

export default function JoistCalculator() {
  const [length, setLength] = useState("");
  const [spacing, setSpacing] = useState("16");
  const [stockLen, setStockLen] = useState("16");

  const L = num(length), sp = num(spacing);
  const joistCount = sp > 0 && L > 0 ? Math.ceil((L * 12) / sp) + 1 : 0;
  const stock = num(stockLen);
  const pieces = stock > 0 ? joistCount : 0; // same count, each spanning width

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Floor / deck frame</h2>
        <div><label className={labelCls}>Frame length to span (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Joist spacing</label>
            <select className={inputCls} value={spacing} onChange={e => setSpacing(e.target.value)}>
              <option value="12">12&quot; OC</option>
              <option value="16">16&quot; OC (standard)</option>
              <option value="24">24&quot; OC</option>
            </select></div>
          <div><label className={labelCls}>Joist length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="16" className={inputCls} value={stockLen} onChange={e => setStockLen(e.target.value)} /></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Enter the length of the frame being spanned. Joist length = the span across the width (e.g. deck depth). Add rim joists and blocking separately.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Joists</div>
          <div className="text-3xl font-bold">{joistCount}</div>
          <div className="text-xs opacity-80">{spacing}&quot; on center, {stock || "?"} ft long</div>
        </div>
        <div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Total linear feet</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{(pieces * stock).toLocaleString("en-US")} ft</span></div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add rim joists (2 × frame length) and blocking rows. Sizing (2×6, 2×8, 2×10) depends on span and load — always check span tables or engineering.</p>
      </div>
    </div>
  );
}
