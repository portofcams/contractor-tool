"use client";

import { useState } from "react";
import { inputCls, labelCls, num, fmt } from "../_components/calc-ui";

type Area = { id: number; length: string; width: string };

export default function SquareFootageCalculator() {
  const [areas, setAreas] = useState<Area[]>([{ id: 1, length: "", width: "" }]);

  const add = () =>
    setAreas((a) => [...a, { id: (a[a.length - 1]?.id ?? 0) + 1, length: "", width: "" }]);
  const remove = (id: number) =>
    setAreas((a) => (a.length > 1 ? a.filter((x) => x.id !== id) : a));
  const upd = (id: number, k: "length" | "width", v: string) =>
    setAreas((a) => a.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const total = areas.reduce((s, a) => s + num(a.length) * num(a.width), 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5">
        <h2 className="text-lg font-semibold mb-4">Areas (feet)</h2>
        <div className="space-y-3">
          {areas.map((r, i) => (
            <div key={r.id} className="flex items-end gap-2">
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Length</label>}
                <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls}
                  value={r.length} onChange={(e) => upd(r.id, "length", e.target.value)}
                  aria-label={`Area ${i + 1} length in feet`} />
              </div>
              <span className="pb-2 text-neutral-400">×</span>
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Width</label>}
                <input type="number" inputMode="decimal" min="0" placeholder="0" className={inputCls}
                  value={r.width} onChange={(e) => upd(r.id, "width", e.target.value)}
                  aria-label={`Area ${i + 1} width in feet`} />
              </div>
              <button type="button" onClick={() => remove(r.id)} disabled={areas.length === 1}
                className="pb-2 text-neutral-400 hover:text-red-500 disabled:opacity-30"
                aria-label={`Remove area ${i + 1}`}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={add}
          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          + Add an area
        </button>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Tip: for an L-shaped room, split it into rectangles and add each as its own area.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
        <h2 className="text-lg font-semibold mb-4">Total area</h2>
        <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
          <div className="text-sm opacity-90">Square feet</div>
          <div className="text-3xl font-bold">{fmt(total)} sq ft</div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="Square yards" value={fmt(total / 9)} />
          <Row label="Square meters" value={fmt(total * 0.092903)} />
          <Row label="Acres" value={(total / 43560).toLocaleString("en-US", { maximumFractionDigits: 4 })} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}
