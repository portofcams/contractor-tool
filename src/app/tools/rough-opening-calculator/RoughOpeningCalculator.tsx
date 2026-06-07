"use client";
import { useState } from "react";
import { inputCls, labelCls, num } from "../_components/calc-ui";

export default function RoughOpeningCalculator() {
  const [nomW, setNomW] = useState("");
  const [nomH, setNomH] = useState("");
  const [type, setType] = useState("door");

  const W = num(nomW), H = num(nomH);
  // Standard rough opening: window = +1/2" each side = +1" W, +1/2" head
  // Door = +2" W, +2.5" H (for jack/king stud + shim space)
  const roW = type === "door" ? W + 2 : W + 1;
  const roH = type === "door" ? H + 2.5 : H + 0.5;
  // Header size (rough guide — always consult code)
  const span = roW;
  const headerSize = span <= 36 ? "4×4 or (2) 2×4" : span <= 60 ? "(2) 2×6" : span <= 84 ? "(2) 2×8" : span <= 108 ? "(2) 2×10" : "(2) 2×12 or engineered";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Opening</h2>
        <div><label className={labelCls}>Type</label>
          <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
            <option value="door">Door</option>
            <option value="window">Window</option>
          </select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Nominal width (in)</label><input type="number" inputMode="decimal" min="0" placeholder='e.g. 36' className={inputCls} value={nomW} onChange={e => setNomW(e.target.value)} /></div>
          <div><label className={labelCls}>Nominal height (in)</label><input type="number" inputMode="decimal" min="0" placeholder='e.g. 80' className={inputCls} value={nomH} onChange={e => setNomH(e.target.value)} /></div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Enter the door or window unit size (the size on the label). The rough opening is cut larger for framing and shimming.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Rough opening</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Width × Height</div>
          <div className="text-3xl font-bold">{roW > 0 ? `${roW}"` : "—"} × {roH > 0 ? `${roH}"` : "—"}</div>
          <div className="text-xs opacity-80">{W > 0 ? `${W}" × ${H}" nominal` : "enter dimensions"}</div>
        </div>
        {roW > 0 && <div className="mt-4 flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">Header guide</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 text-sm">{headerSize}</span></div>}
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Header sizing depends on load, species, and local code — always verify with span tables. Double check RO against manufacturer specs before framing.</p>
      </div>
    </div>
  );
}
