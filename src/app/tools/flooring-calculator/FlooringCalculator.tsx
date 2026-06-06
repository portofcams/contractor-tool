"use client";

import { useState } from "react";

type Room = { id: number; length: string; width: string };

const WASTE_OPTIONS = [
  { v: 5, label: "5% — simple square rooms" },
  { v: 10, label: "10% — standard (recommended)" },
  { v: 15, label: "15% — diagonal / lots of cuts" },
  { v: 20, label: "20% — herringbone / complex" },
];

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function FlooringCalculator() {
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, length: "", width: "" }]);
  const [waste, setWaste] = useState(10);
  const [coverage, setCoverage] = useState("20");
  const [price, setPrice] = useState("");

  const addRoom = () =>
    setRooms((r) => [...r, { id: (r[r.length - 1]?.id ?? 0) + 1, length: "", width: "" }]);
  const removeRoom = (id: number) =>
    setRooms((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  const update = (id: number, key: "length" | "width", val: string) =>
    setRooms((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)));

  const totalArea = rooms.reduce((s, r) => s + num(r.length) * num(r.width), 0);
  const cov = num(coverage);
  const areaWithWaste = totalArea * (1 + waste / 100);
  const boxes = cov > 0 ? Math.ceil(areaWithWaste / cov) : 0;
  const ppb = num(price);
  const cost = boxes * ppb;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: n < 100 ? 1 : 0 });

  const inputCls =
    "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Inputs */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Your rooms
        </h2>
        <div className="space-y-3">
          {rooms.map((r, i) => (
            <div key={r.id} className="flex items-end gap-2">
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Length (ft)</label>}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="0"
                  className={inputCls}
                  value={r.length}
                  onChange={(e) => update(r.id, "length", e.target.value)}
                  aria-label={`Room ${i + 1} length in feet`}
                />
              </div>
              <span className="pb-2 text-neutral-400">×</span>
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Width (ft)</label>}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="0"
                  className={inputCls}
                  value={r.width}
                  onChange={(e) => update(r.id, "width", e.target.value)}
                  aria-label={`Room ${i + 1} width in feet`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeRoom(r.id)}
                className="pb-2 text-neutral-400 hover:text-red-500 disabled:opacity-30"
                disabled={rooms.length === 1}
                aria-label={`Remove room ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRoom}
          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          + Add a room
        </button>

        <div className="mt-5 space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div>
            <label className={labelCls}>Waste / overage</label>
            <select
              className={inputCls}
              value={waste}
              onChange={(e) => setWaste(Number(e.target.value))}
            >
              {WASTE_OPTIONS.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Coverage per box (sq ft)</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                className={inputCls}
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Price per box ($, optional)</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="—"
                className={inputCls}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          You&apos;ll need
        </h2>
        <div className="space-y-4">
          <Stat label="Total floor area" value={`${fmt(totalArea)} sq ft`} />
          <Stat
            label={`With ${waste}% waste`}
            value={`${fmt(areaWithWaste)} sq ft`}
            sub
          />
          <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
            <div className="text-sm opacity-90">Boxes to buy</div>
            <div className="text-3xl font-bold">{boxes}</div>
            <div className="text-xs opacity-80">
              at {cov || "—"} sq ft per box
            </div>
          </div>
          {ppb > 0 && (
            <Stat
              label="Estimated material cost"
              value={`$${cost.toLocaleString("en-US", { maximumFractionDigits: 2 })}`}
            />
          )}
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          Estimate only. Always confirm box coverage on the product label and buy
          from the same dye lot. Round up — you&apos;ll want offcuts for repairs.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`text-sm ${sub ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-700 dark:text-neutral-300"}`}
      >
        {label}
      </span>
      <span
        className={`font-semibold tabular-nums ${sub ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-900 dark:text-neutral-100 text-lg"}`}
      >
        {value}
      </span>
    </div>
  );
}
