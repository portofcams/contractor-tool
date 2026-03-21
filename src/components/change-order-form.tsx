"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const REASONS = [
  { value: "client_request", label: "Client Request" },
  { value: "unforeseen", label: "Unforeseen Conditions" },
  { value: "code_compliance", label: "Code Compliance" },
  { value: "design_change", label: "Design Change" },
  { value: "error", label: "Error / Omission" },
  { value: "other", label: "Other" },
];

export function ChangeOrderForm({ projectId, onSaved, onCancel }: { projectId: string; onSaved: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("client_request");
  const [costType, setCostType] = useState<"add" | "credit">("add");
  const [costAmount, setCostAmount] = useState("");
  const [daysImpact, setDaysImpact] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSaving(true);
    try {
      const cost = parseFloat(costAmount) || 0;
      await fetch(`/api/projects/${projectId}/change-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          reason,
          costImpact: costType === "credit" ? -cost : cost,
          daysImpact: parseInt(daysImpact) || 0,
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
        <label className="text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Add recessed lighting" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the scope change..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
      </div>
      <div>
        <label className="text-sm font-medium">Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
          {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Cost Impact</label>
          <div className="flex mt-1 gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
              <button type="button" onClick={() => setCostType("add")} className={`px-3 py-2 text-sm ${costType === "add" ? "bg-red-500/15 text-red-500" : "bg-background"}`}>+ Add</button>
              <button type="button" onClick={() => setCostType("credit")} className={`px-3 py-2 text-sm ${costType === "credit" ? "bg-green-500/15 text-green-500" : "bg-background"}`}>- Credit</button>
            </div>
            <input type="number" step="0.01" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Days Impact</label>
          <input type="number" value={daysImpact} onChange={(e) => setDaysImpact(e.target.value)} placeholder="0" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Change Order"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
