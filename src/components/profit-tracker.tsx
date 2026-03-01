"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActualCost {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

const CATEGORIES = ["materials", "labor", "other"] as const;

function categoryLabel(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function ProfitTracker({
  jobId,
  quotedTotal,
  actualCosts: initialCosts,
}: {
  jobId: string;
  quotedTotal: number;
  actualCosts: ActualCost[];
}) {
  const [costs, setCosts] = useState(initialCosts);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const profit = quotedTotal - totalCosts;
  const profitPercent =
    quotedTotal > 0 ? ((profit / quotedTotal) * 100).toFixed(1) : "0.0";

  // Breakdown by category
  const breakdown = CATEGORIES.map((cat) => ({
    category: cat,
    total: costs
      .filter((c) => c.category === cat)
      .reduce((sum, c) => sum + c.amount, 0),
  }));

  async function addCost() {
    if (!description.trim() || !amount || !category) return;
    setSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cost",
          description,
          amount: parseFloat(amount),
          category,
        }),
      });

      if (res.ok) {
        const cost = await res.json();
        setCosts((prev) => [...prev, cost]);
        setDescription("");
        setAmount("");
        setCategory("");
        setShowForm(false);
        setStatusMessage("Cost added.");
      } else {
        setStatusMessage("Failed to add cost.");
      }
    } catch {
      setStatusMessage("Failed to add cost.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Profit Tracker</h3>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">Quoted</p>
          <p className="text-lg font-semibold">
            ${quotedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border border-border rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">Costs</p>
          <p className="text-lg font-semibold">
            ${totalCosts.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border border-border rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">Profit</p>
          <p
            className={`text-lg font-semibold ${
              profit >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ${Math.abs(profit).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
            {profit < 0 && (
              <span className="text-xs ml-1">loss</span>
            )}
          </p>
          <p
            className={`text-xs ${
              profit >= 0 ? "text-green-400/70" : "text-red-400/70"
            }`}
          >
            {profitPercent}%
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="border border-border rounded-lg p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          Breakdown by Category
        </p>
        {breakdown.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between text-sm"
          >
            <span>{categoryLabel(item.category)}</span>
            <span className="font-mono text-muted-foreground">
              ${item.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Cost entries */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          Cost Entries ({costs.length})
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Cost"}
        </Button>
      </div>

      {/* Add cost form */}
      {showForm && (
        <div className="border border-border rounded-lg p-3 space-y-3 bg-secondary/50">
          <div className="space-y-1.5">
            <Label htmlFor="cost-description">Description</Label>
            <Input
              id="cost-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lumber for framing"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cost-amount">Amount ($)</Label>
              <Input
                id="cost-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cost-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="cost-category" className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={addCost}
              disabled={!description.trim() || !amount || !category || saving}
            >
              {saving ? "Saving..." : "Save Cost"}
            </Button>
          </div>
        </div>
      )}

      {costs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2 text-center">
          No costs recorded yet. Add costs to track profitability.
        </p>
      ) : (
        <ul className="space-y-2 list-none p-0" aria-label="Cost entries">
          {costs.map((cost) => (
            <li
              key={cost.id}
              className="border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="text-sm truncate">{cost.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {categoryLabel(cost.category)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(cost.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className="text-sm font-mono font-medium ml-3">
                ${cost.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Live region for status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
    </div>
  );
}
