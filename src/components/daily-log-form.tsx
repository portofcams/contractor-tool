"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyLogData {
  date: string;
  weather: string;
  temperature: string;
  crewOnSite: { name: string; role: string; hoursWorked: number }[];
  workCompleted: string;
  issues: string;
  materialsUsed: { item: string; qty: number; unit: string }[];
  safetyNotes: string;
  delayReason: string;
  delayHours: string;
}

const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny" },
  { value: "partly_cloudy", label: "Partly Cloudy" },
  { value: "cloudy", label: "Cloudy" },
  { value: "rainy", label: "Rainy" },
  { value: "stormy", label: "Stormy" },
  { value: "snow", label: "Snow" },
  { value: "windy", label: "Windy" },
  { value: "foggy", label: "Foggy" },
];

const DELAY_REASONS = [
  { value: "", label: "No delay" },
  { value: "weather", label: "Weather" },
  { value: "material", label: "Material delay" },
  { value: "sub_no_show", label: "Sub no-show" },
  { value: "permit", label: "Permit issue" },
  { value: "inspection", label: "Inspection" },
  { value: "client_change", label: "Client change" },
  { value: "other", label: "Other" },
];

export function DailyLogForm({ projectId, onSaved, onCancel }: { projectId: string; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState<DailyLogData>({
    date: new Date().toISOString().split("T")[0],
    weather: "sunny",
    temperature: "",
    crewOnSite: [{ name: "", role: "", hoursWorked: 8 }],
    workCompleted: "",
    issues: "",
    materialsUsed: [],
    safetyNotes: "",
    delayReason: "",
    delayHours: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const crew = form.crewOnSite.filter((c) => c.name.trim());
      const materials = form.materialsUsed.filter((m) => m.item.trim());
      await fetch(`/api/projects/${projectId}/daily-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          crewOnSite: crew.length > 0 ? crew : null,
          materialsUsed: materials.length > 0 ? materials : null,
          delayReason: form.delayReason || null,
          delayHours: form.delayHours || null,
        }),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  function addCrew() {
    setForm({ ...form, crewOnSite: [...form.crewOnSite, { name: "", role: "", hoursWorked: 8 }] });
  }

  function removeCrew(i: number) {
    setForm({ ...form, crewOnSite: form.crewOnSite.filter((_, idx) => idx !== i) });
  }

  function updateCrew(i: number, field: string, value: string | number) {
    const crew = [...form.crewOnSite];
    crew[i] = { ...crew[i], [field]: value };
    setForm({ ...form, crewOnSite: crew });
  }

  function addMaterial() {
    setForm({ ...form, materialsUsed: [...form.materialsUsed, { item: "", qty: 0, unit: "" }] });
  }

  function removeMaterial(i: number) {
    setForm({ ...form, materialsUsed: form.materialsUsed.filter((_, idx) => idx !== i) });
  }

  function updateMaterial(i: number, field: string, value: string | number) {
    const mats = [...form.materialsUsed];
    mats[i] = { ...mats[i], [field]: value };
    setForm({ ...form, materialsUsed: mats });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Weather</label>
          <select value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
            {WEATHER_OPTIONS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Temperature (°F)</label>
          <input type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="72" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
        </div>
      </div>

      {/* Crew on site */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Crew On Site</label>
          <Button type="button" variant="outline" size="sm" onClick={addCrew}>+ Add</Button>
        </div>
        {form.crewOnSite.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_80px_32px] gap-2 mb-2">
            <input placeholder="Name" value={c.name} onChange={(e) => updateCrew(i, "name", e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <input placeholder="Role" value={c.role} onChange={(e) => updateCrew(i, "role", e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <input type="number" placeholder="Hrs" value={c.hoursWorked} onChange={(e) => updateCrew(i, "hoursWorked", parseFloat(e.target.value) || 0)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <button type="button" onClick={() => removeCrew(i)} className="text-red-500 hover:text-red-400 text-sm">x</button>
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium">Work Completed</label>
        <textarea value={form.workCompleted} onChange={(e) => setForm({ ...form, workCompleted: e.target.value })} rows={3} placeholder="Describe work completed today..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium">Issues / Problems</label>
        <textarea value={form.issues} onChange={(e) => setForm({ ...form, issues: e.target.value })} rows={2} placeholder="Any issues encountered..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
      </div>

      {/* Materials used */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Materials Used</label>
          <Button type="button" variant="outline" size="sm" onClick={addMaterial}>+ Add</Button>
        </div>
        {form.materialsUsed.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 mb-2">
            <input placeholder="Material" value={m.item} onChange={(e) => updateMaterial(i, "item", e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <input type="number" placeholder="Qty" value={m.qty || ""} onChange={(e) => updateMaterial(i, "qty", parseFloat(e.target.value) || 0)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <input placeholder="Unit" value={m.unit} onChange={(e) => updateMaterial(i, "unit", e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
            <button type="button" onClick={() => removeMaterial(i)} className="text-red-500 hover:text-red-400 text-sm">x</button>
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium">Safety Notes</label>
        <textarea value={form.safetyNotes} onChange={(e) => setForm({ ...form, safetyNotes: e.target.value })} rows={2} placeholder="Safety observations..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
      </div>

      {/* Delay tracking */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Delay Reason</label>
          <select value={form.delayReason} onChange={(e) => setForm({ ...form, delayReason: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
            {DELAY_REASONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        {form.delayReason && (
          <div>
            <label className="text-sm font-medium">Delay Hours</label>
            <input type="number" step="0.5" value={form.delayHours} onChange={(e) => setForm({ ...form, delayHours: e.target.value })} placeholder="0" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Log Entry"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
