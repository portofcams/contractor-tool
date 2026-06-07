"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function FramingCostCalculator() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("8");
  const [spacing, setSpacing] = useState("16");
  const [price, setPrice] = useState("6");

  const L = num(length);
  const H = num(height);
  const sp = num(spacing);

  // Studs: one per spacing interval + 1 end stud
  const studs = L > 0 && sp > 0 ? Math.ceil((L / (sp / 12))) + 1 : 0;
  // Plates: 3 plates × wall length (2 bottom + 1 top for non-bearing; adjust manually for bearing)
  const plateLf = L * 3;
  // Total lumber LF (studs at wall height + plates)
  const totalLf = studs * H + plateLf;
  const cost = totalLf * num(price) / 8; // price per 8-ft stick

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Wall dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Wall length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="20" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Wall height (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={height} onChange={e => setHeight(e.target.value)} /></div>
        </div>
        <div>
          <label className={labelCls}>Stud spacing</label>
          <select className={inputCls} value={spacing} onChange={e => setSpacing(e.target.value)}>
            <option value="16">16 in OC (standard)</option>
            <option value="24">24 in OC (advanced framing)</option>
            <option value="12">12 in OC (heavy load)</option>
          </select>
        </div>
        <div><label className={labelCls}>Lumber cost per 8-ft stick ($)</label><input type="number" inputMode="decimal" min="0" placeholder="6" className={inputCls} value={price} onChange={e => setPrice(e.target.value)} /></div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Includes 3 plates (2 bottom + 1 top). Add end studs, headers, and blocking separately. Lumber prices vary — get a current supplier quote.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Material estimate</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Est. material cost</div>
          <div className="text-3xl font-bold">${fmt(cost * 1.1)}</div>
          <div className="text-xs opacity-80">includes 10% waste</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Studs</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{studs}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Plate lumber (3 plates)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(plateLf)} lf</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Total linear feet</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(totalLf)} lf</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add headers, blocking, cripple studs, and hardware for full cost. Labor typically 2–3× material cost.</p>
      </div>
    </div>
  );
}
