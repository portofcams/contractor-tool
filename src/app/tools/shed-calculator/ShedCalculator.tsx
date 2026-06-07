"use client";
import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

export default function ShedCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [wallH, setWallH] = useState("8");
  const [pitch, setPitch] = useState("4");
  const [spacing, setSpacing] = useState("16");

  const L = num(length), W = num(width), H = num(wallH);
  const pitchRise = num(pitch); // rise per 12-in run

  // Floor: plywood sheets (3/4-in, 4x8)
  const floorSqft = L * W;
  const floorSheets = Math.ceil((floorSqft / 32) * 1.1);

  // Walls: 4 walls of sheathing (OSB/plywood 4x8)
  const perimSqft = (L + W) * 2 * H;
  const wallSheets = Math.ceil((perimSqft / 32) * 1.1);

  // Studs for 4 walls
  const perimeter = (L + W) * 2;
  const studs = Math.ceil(perimeter / (num(spacing) / 12)) + 8; // +8 for corners

  // Roof: simple gable — area = ridge run × slope factor × 2 sides
  const slopeFactor = Math.sqrt(1 + (pitchRise / 12) ** 2);
  const roofSqft = (W / 2) * slopeFactor * 2 * L;
  const roofSheets = Math.ceil((roofSqft / 32) * 1.1);
  const roofingSquares = Math.ceil((roofSqft / 100) * 1.1); // 1 sq = 100 sqft

  // Siding: same as wall area (LP SmartSide / T1-11 panels 4x8)
  const sidingSheets = Math.ceil((perimSqft / 32) * 1.1);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Shed dimensions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Length (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="12" className={inputCls} value={length} onChange={e => setLength(e.target.value)} /></div>
          <div><label className={labelCls}>Width (ft)</label><input type="number" inputMode="decimal" min="0" placeholder="16" className={inputCls} value={width} onChange={e => setWidth(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Wall height (ft)</label>
            <select className={inputCls} value={wallH} onChange={e => setWallH(e.target.value)}>
              <option value="7">7 ft</option>
              <option value="8">8 ft (standard)</option>
              <option value="9">9 ft</option>
              <option value="10">10 ft</option>
            </select>
          </div>
          <div><label className={labelCls}>Roof pitch (in rise/12)</label>
            <select className={inputCls} value={pitch} onChange={e => setPitch(e.target.value)}>
              <option value="3">3/12 — low</option>
              <option value="4">4/12 — standard</option>
              <option value="6">6/12 — steeper</option>
              <option value="8">8/12 — steep</option>
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Stud spacing</label>
          <select className={inputCls} value={spacing} onChange={e => setSpacing(e.target.value)}>
            <option value="16">16 in OC</option>
            <option value="24">24 in OC</option>
          </select>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">All quantities include 10% waste. Excludes door/window framing, hardware, and foundation.</p>
      </div>
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Material list</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Footprint</div>
          <div className="text-3xl font-bold">{fmt(floorSqft)} sq ft</div>
          <div className="text-xs opacity-80">{L > 0 && W > 0 ? `${L} × ${W} ft gable shed` : "enter dimensions"}</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Studs</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{studs}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Floor plywood (4×8, 3/4-in)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{floorSheets} sheets</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Wall sheathing (OSB 4×8)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{wallSheets} sheets</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Roof sheathing (OSB 4×8)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{roofSheets} sheets</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Roofing (squares of shingles)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{roofingSquares} sq</span></div>
          <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Siding panels (4×8)</span><span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{sidingSheets} sheets</span></div>
        </div>
      </div>
    </div>
  );
}
