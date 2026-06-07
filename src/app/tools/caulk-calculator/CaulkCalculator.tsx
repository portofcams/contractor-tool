"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function CaulkCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("0.25");
  const [depth, setDepth] = useState("0.25");

  const L = num(length), W = num(width), D = num(depth);
  // volume in cubic inches per linear foot
  const cuInPerFt = W * D * 12;
  // standard 10 oz tube ≈ 17.3 cubic inches
  const tubeCapacity = 17.3;
  const tubesNeeded = cuInPerFt > 0 && L > 0 ? Math.ceil((L * cuInPerFt) / tubeCapacity) : 0;
  const linFtPerTube = cuInPerFt > 0 ? tubeCapacity / cuInPerFt : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Joint</h2>
        <div><label className={labelCls}>Total joint length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Joint width (in)</label>
            <select className={inputCls} value={width} onChange={e => setWidth(e.target.value)}>
              <option value="0.125">1/8&quot;</option>
              <option value="0.25">1/4&quot; (standard)</option>
              <option value="0.375">3/8&quot;</option>
              <option value="0.5">1/2&quot;</option>
            </select></div>
          <div><label className={labelCls}>Joint depth (in)</label>
            <select className={inputCls} value={depth} onChange={e => setDepth(e.target.value)}>
              <option value="0.125">1/8&quot;</option>
              <option value="0.25">1/4&quot; (standard)</option>
              <option value="0.375">3/8&quot;</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">A standard 10 oz caulk tube covers ~17 cu in. Use a backer rod to reduce depth on gaps over 1/2&quot;.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Caulk tubes (10 oz)</div>
          <div className="text-3xl font-bold">{tubesNeeded}</div>
        </div>
        {linFtPerTube > 0 && <div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Coverage per tube</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">~{fmt(linFtPerTube)} linear ft</span></div>}
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Add 10–15% for waste and imperfect beads. Use backer rod for joints deeper than 1/2&quot; to save caulk and prevent three-point adhesion.</p>
      </div>
    </div>
  );
}
