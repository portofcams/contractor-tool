"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    customerId: "",
    address: "",
    priority: "medium",
    startDate: "",
    estimatedEnd: "",
    budgetEstimated: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerId: form.customerId || null,
        }),
      });
      const project = await res.json();
      router.push(`/projects/${project.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Project</h1>
        <p className="text-muted-foreground">Create a new construction project</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Kitchen Renovation — Smith Residence"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Project scope and overview..."
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Job site address"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Estimated End</label>
                <input
                  type="date"
                  value={form.estimatedEnd}
                  onChange={(e) => setForm({ ...form, estimatedEnd: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Estimated Budget ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.budgetEstimated}
                onChange={(e) => setForm({ ...form, budgetEstimated: e.target.value })}
                placeholder="0.00"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Additional notes..."
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Project"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
