"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function BathroomTileCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [wallH, setWallH] = useState("0");
  const [coverage, setCoverage] = useState("16");
  const [waste, setWaste] = useState("10");
  const [tileW, setTileW] = useState("12");
  const [tileH, setTileH] = useState("12");
  const [jointW, setJointW] = useState("3/16");

  const L = num(length), W = num(width), wH = num(wallH);
  const floorArea = L * W;
  const wallArea = wH > 0 ? (L + W) * 2 * wH : 0;
  const totalArea = floorArea + wallArea;
  const withWaste = totalArea * (1 + num(waste) / 100);
  const boxes = Math.ceil(withWaste / num(coverage));

  // Grout estimate: lb per sqft based on tile size and joint
  const tw = num(tileW), th = num(tileH);
  const jointIn = jointW === "3/16" ? 0.1875 : jointW === "1/8" ? 0.125 : jointW === "1/4" ? 0.25 : 0.1875;
  const groutLbPerSqft = tw > 0 && th > 0
    ? (tw + th) / (tw * th) * jointIn * 0.2 * 144
    : 0;
  const groutLbs = totalArea * groutLbPerSqft;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Bathroom dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="8" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="5" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Wall tile height (ft, 0 = floor only)</label><input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls} value={wallH} onChange={e => setWallH(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Tile W × H (in)</label>
            <div className="flex gap-1">
              <input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileW} onChange={e => setTileW(e.target.value)} />
              <span className="self-center text-neutral-400">×</span>
              <input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={tileH} onChange={e => setTileH(e.target.value)} />
            </div>
          </div>
          <div><label className={labelCls}>Joint width</label>
            <select className={inputCls} value={jointW} onChange={e => setJointW(e.target.value)}>
              <option value="1/8">1/8 in</option>
              <option value="3/16">3/16 in</option>
              <option value="1/4">1/4 in</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Box coverage (sq ft)</label><input type="number" inputMode="decimal" min="0" placeholder="16" className={inputCls} value={coverage} onChange={e => setCoverage(e.target.value)} /></div>
          <div><label className={labelCls}>Waste %</label>
            <select className={inputCls} value={waste} onChange={e => setWaste(e.target.value)}>
              <option value="10">10% (straight)</option>
              <option value="15">15% (diagonal)</option>
              <option value="20">20% (herringbone)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">You&apos;ll need</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Tile boxes</div>
          <div className="text-3xl font-bold">{boxes}</div>
          <div className="text-xs opacity-80">{fmt(withWaste)} sq ft with waste</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Floor area</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(floorArea)} sq ft</span></div>
          {wallArea > 0 && <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Wall area</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(wallArea)} sq ft</span></div>}
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Grout needed (est.)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{fmt(groutLbs)} lb</span></div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Buy grout from one batch for consistent color. Check box coverage on the actual carton label.</p>
      </div>
    </div>
  );
}
