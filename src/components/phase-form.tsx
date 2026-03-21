"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PhaseFormProps {
  projectId: string;
  existingPhases: { id: string; name: string }[];
  onSaved: () => void;
  onCancel: () => void;
  initial?: { id: string; name: string; description: string | null; startDate: string | null; endDate: string | null; dependsOnId: string | null; budgetEstimated: number | null; color: string | null };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#64748b"];

export function PhaseForm({ projectId, existingPhases, onSaved, onCancel, initial }: PhaseFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [startDate, setStartDate] = useState(initial?.startDate?.split("T")[0] || "");
  const [endDate, setEndDate] = useState(initial?.endDate?.split("T")[0] || "");
  const [dependsOnId, setDependsOnId] = useState(initial?.dependsOnId || "");
  const [budgetEstimated, setBudgetEstimated] = useState(initial?.budgetEstimated?.toString() || "");
  const [color, setColor] = useState(initial?.color || COLORS[0]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const url = initial ? `/api/projects/${projectId}/phases/${initial.id}` : `/api/projects/${projectId}/phases`;
      await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          startDate: startDate || null,
          endDate: endDate || null,
          dependsOnId: dependsOnId || null,
          budgetEstimated: budgetEstimated || null,
          color,
        }),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Phase Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Demolition, Framing, Electrical" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What this phase involves..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Depends On</label>
        <select value={dependsOnId} onChange={(e) => setDependsOnId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
          <option value="">None (independent)</option>
          {existingPhases.filter((p) => p.id !== initial?.id).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Estimated Budget</label>
        <input type="number" step="0.01" value={budgetEstimated} onChange={(e) => setBudgetEstimated(e.target.value)} placeholder="0.00" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">Color</label>
        <div className="flex gap-2 mt-1">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? "border-white scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : initial ? "Update Phase" : "Add Phase"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
