"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function WoodFenceCostCalculator() {
  const [fenceLen, setFenceLen] = useState("");
  const [fenceH, setFenceH] = useState("6");
  const [postSpacing, setPostSpacing] = useState("8");
  const [wood, setWood] = useState("pt");
  const [style, setStyle] = useState("privacy");

  const L = num(fenceLen), H = num(fenceH), sp = num(postSpacing);
  const posts = L > 0 && sp > 0 ? Math.ceil(L / sp) + 1 : 0;
  const rails = H <= 4 ? 2 : 3;
  const railLf = (posts > 1 ? posts - 1 : 0) * sp * rails;
  // Pickets: 3.5-in wide + 0.25-in gap = 3.75 in per picket
  const pickets = style === "privacy"
    ? Math.ceil((L * 12) / 3.75)
    : style === "board-on-board"
      ? Math.ceil((L * 12) / 3.0)
      : Math.ceil((L * 12) / 5.5); // split rail / shadow box
  const postH = H + 2.5; // posts need to be longer than fence
  const postLen = postH <= 8 ? 8 : postH <= 10 ? 10 : 12;

  // Material unit prices by wood type (rough estimates)
  const prices: Record<string, { post4x4: number; rail2x4: number; picket: number }> = {
    pt:   { post4x4: 18, rail2x4: 7,  picket: 3 },   // pressure-treated pine
    cedar: { post4x4: 28, rail2x4: 10, picket: 5 },
    redwood: { post4x4: 40, rail2x4: 14, picket: 7 },
  };
  const p = prices[wood] || prices.pt;
  const matCost = posts * p.post4x4 + railLf / 8 * p.rail2x4 + pickets * p.picket;
  const totalLow = matCost * 1.1;
  const totalHigh = matCost * 1.3;
  const concreteBags = posts; // one 50 lb bag per post hole (firm soil)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Fence details</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Fence length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="100" className={inputCls} value={fenceLen} onChange={e => setFenceLen(e.target.value)} /></div>
          <div><label className={labelCls}>Fence height (ft)</label>
            <select className={inputCls} value={fenceH} onChange={e => setFenceH(e.target.value)}>
              <option value="4">4 ft</option>
              <option value="6">6 ft (standard privacy)</option>
              <option value="8">8 ft</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Post spacing (ft)</label>
            <select className={inputCls} value={postSpacing} onChange={e => setPostSpacing(e.target.value)}>
              <option value="6">6 ft</option>
              <option value="8">8 ft (standard)</option>
            </select>
          </div>
          <div><label className={labelCls}>Style</label>
            <select className={inputCls} value={style} onChange={e => setStyle(e.target.value)}>
              <option value="privacy">Privacy (solid)</option>
              <option value="board-on-board">Board-on-board</option>
              <option value="picket">Picket (open)</option>
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Wood type</label>
          <select className={inputCls} value={wood} onChange={e => setWood(e.target.value)}>
            <option value="pt">Pressure-treated pine</option>
            <option value="cedar">Western red cedar</option>
            <option value="redwood">Redwood</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Material estimate</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Material cost (est.)</div>
          <div className="text-3xl font-bold">${Math.round(totalLow)}–${Math.round(totalHigh)}</div>
          <div className="text-xs opacity-80">includes 10–30% waste + variation</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">4×4 posts ({postLen}-ft)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{posts}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">2×4 rails ({rails} per bay)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{Math.ceil(railLf / 8)} sticks</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Pickets / boards</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{pickets}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Concrete bags (post holes)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{concreteBags}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Prices are rough market estimates — get supplier quotes. Labor typically 1.5–2× material. Add gate hardware separately.</p>
      </div>
    </div>
  );
}
