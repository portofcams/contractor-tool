"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function GroutCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [tileW, setTileW] = useState("12");
  const [tileH, setTileH] = useState("12");
  const [joint, setJoint] = useState("0.125");
  const [depth, setDepth] = useState("0.25");

  const area = num(length) * num(width);
  const tw = num(tileW), th = num(tileH), j = num(joint), d = num(depth);
  // lbs/sqft = (tw+th)/(tw*th) * joint_width * joint_depth * density(~130lb/cuft) / 144
  const lbsPerSqft = tw > 0 && th > 0 ? ((tw + th) / (tw * th)) * j * d * 130 / 144 : 0;
  const totalLbs = area * lbsPerSqft;
  const bags10 = Math.ceil(totalLbs / 10);
  const bags25 = Math.ceil(totalLbs / 25);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Area &amp; tile</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Tile width (in)</label><input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileW} onChange={e => setTileW(e.target.value)} /></div>
          <div><label className={labelCls}>Tile height (in)</label><input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileH} onChange={e => setTileH(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Joint width (in)</label>
            <select className={inputCls} value={joint} onChange={e => setJoint(e.target.value)}>
              <option value="0.0625">1/16&quot;</option>
              <option value="0.125">1/8&quot; (standard)</option>
              <option value="0.1875">3/16&quot;</option>
              <option value="0.25">1/4&quot;</option>
            </select></div>
          <div><label className={labelCls}>Tile thickness (in)</label>
            <select className={inputCls} value={depth} onChange={e => setDepth(e.target.value)}>
              <option value="0.25">1/4&quot;</option>
              <option value="0.375">3/8&quot;</option>
              <option value="0.5">1/2&quot;</option>
            </select></div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Area</span><span className="font-semibold tabular-nums">{fmt(area)} sq ft</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Grout</div>
          <div className="text-3xl font-bold">{totalLbs.toLocaleString("en-US", { maximumFractionDigits: 1 })} lb</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">10 lb bags</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{bags10}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">25 lb bags</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{bags25}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Estimate only — mix density and joint fill vary. Sanded grout for joints ≥1/8&quot;; unsanded for smaller gaps.</p>
      </div>
    </div>
  );
}
