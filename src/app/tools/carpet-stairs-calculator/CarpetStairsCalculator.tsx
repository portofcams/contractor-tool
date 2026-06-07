"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function CarpetStairsCalculator() {
  const [steps, setSteps] = useState("");
  const [stairWidth, setStairWidth] = useState("36");
  const [rise, setRise] = useState("7.5");
  const [tread, setTread] = useState("10");
  const [style, setStyle] = useState("waterfall");
  const [waste, setWaste] = useState(15);

  const n = num(steps), W = num(stairWidth) / 12; // width in ft
  const riseIn = num(rise), treadIn = num(tread);
  // waterfall: tread + rise per step; upholstered: tread + rise + extra wrap
  const inchesPerStep = style === "waterfall" ? treadIn + riseIn + 2 : treadIn + riseIn + 4;
  const ftPerStep = inchesPerStep / 12;
  const totalFt = n * ftPerStep * (1 + waste / 100);
  const sqFt = totalFt * W;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Stairs</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Number of steps</label><input type="number" inputMode="numeric" min="0" placeholder="0" className={inputCls} value={steps} onChange={e => setSteps(e.target.value)} /></div>
          <div><label className={labelCls}>Stair width (in)</label><input type="number" inputMode="decimal" min="0" placeholder="36" className={inputCls} value={stairWidth} onChange={e => setStairWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Rise height (in)</label><input type="number" inputMode="decimal" min="0" placeholder="7.5" className={inputCls} value={rise} onChange={e => setRise(e.target.value)} /></div>
          <div><label className={labelCls}>Tread depth (in)</label><input type="number" inputMode="decimal" min="0" placeholder="10" className={inputCls} value={tread} onChange={e => setTread(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Install style</label>
            <select className={inputCls} value={style} onChange={e => setStyle(e.target.value)}>
              <option value="waterfall">Waterfall (fold-over)</option>
              <option value="upholstered">Upholstered (wrapped)</option>
            </select></div>
          <div><label className={labelCls}>Waste</label>
            <select className={inputCls} value={waste} onChange={e => setWaste(Number(e.target.value))}>
              <option value={15}>15% (recommended)</option>
              <option value={20}>20% (patterned)</option>
            </select></div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="flex justify-between text-sm mb-3"><span className="text-neutral-600 dark:text-neutral-400">Per step (inches)</span><span className="font-semibold tabular-nums">{inchesPerStep > 0 ? inchesPerStep : "—"} in</span></div>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Carpet run (+{waste}% waste)</div>
          <div className="text-3xl font-bold">{fmt(totalFt)} ft</div>
          <div className="text-xs opacity-80">{fmt(sqFt)} sq ft</div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Stairs narrower than a 12-ft roll cut from one strip. Add pad and tack strip separately. Always run pile in the same direction down the stairs.</p>
      </div>
    </div>
  );
}
