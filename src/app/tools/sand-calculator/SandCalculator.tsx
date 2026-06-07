"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function SandCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("2");
  const [type, setType] = useState("1.35");

  const area = num(length) * num(width);
  const cuft = area * (num(depth) / 12);
  const cuyd = cuft / 27;
  const tons = cuyd * num(type);
  const bags50 = Math.ceil(cuft / 0.5); // 50lb bag ≈ 0.5 cuft

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Area &amp; depth</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Depth (inches)</label><input type="number" inputMode="decimal" min="0" placeholder="2" className={inputCls} value={depth} onChange={e => setDepth(e.target.value)} /></div>
          <div><label className={labelCls}>Sand type</label>
            <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
              <option value="1.35">Mason / play (~1.35 t/yd³)</option>
              <option value="1.5">Concrete / sharp (~1.5 t/yd³)</option>
              <option value="1.2">Fine / beach (~1.2 t/yd³)</option>
            </select></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Works for bedding sand, sandbox fill, pool base, volleyball courts, and mortar sand. Density varies by moisture content.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Sand (bulk)</div>
          <div className="text-3xl font-bold">{cuyd.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³</div>
          <div className="text-xs opacity-80">{fmt(cuft)} cubic feet</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Weight (approx)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{tons.toLocaleString("en-US", { maximumFractionDigits: 1 })} tons</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">50 lb bags (~0.5 cu ft)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{bags50.toLocaleString("en-US")}</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Order bulk by the yard for large jobs; bags make sense under ~0.5 yd³.</p>
      </div>
    </div>
  );
}
