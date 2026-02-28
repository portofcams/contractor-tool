"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MaterialItem {
  id: string;
  category: string;
  materialType: string;
  unit: string;
  costPerUnit: number;
}

function formatName(s: string): string {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MaterialPricing({
  defaultMaterials,
  customMaterials,
}: {
  defaultMaterials: MaterialItem[];
  customMaterials: MaterialItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});

  // Build lookup of custom prices
  const customMap = new Map<string, number>();
  for (const m of customMaterials) {
    customMap.set(`${m.category}-${m.materialType}`, m.costPerUnit);
  }

  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const m of defaultMaterials) {
      const key = `${m.category}-${m.materialType}`;
      const custom = customMap.get(key);
      initial[key] = custom !== undefined ? custom.toString() : "";
    }
    return initial;
  });

  // Group by category
  const categories = Array.from(
    new Set(defaultMaterials.map((m) => m.category))
  );

  async function handleSave() {
    setLoading(true);
    setResult({});

    // Build overrides: only include non-empty values that differ from default
    const overrides: { category: string; materialType: string; unit: string; costPerUnit: number }[] = [];
    for (const m of defaultMaterials) {
      const key = `${m.category}-${m.materialType}`;
      const val = prices[key];
      if (val !== "" && parseFloat(val) !== m.costPerUnit) {
        overrides.push({
          category: m.category,
          materialType: m.materialType,
          unit: m.unit,
          costPerUnit: parseFloat(val),
        });
      }
    }

    try {
      const res = await fetch("/api/settings/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materials: overrides }),
      });

      if (res.ok) {
        setResult({ success: true, message: "Pricing saved" });
        router.refresh();
      } else {
        const data = await res.json();
        setResult({ success: false, message: data.error || "Failed to save" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Override default material costs. Leave blank to use the default price.
      </p>

      {result.message && (
        <div
          className={`text-sm p-3 rounded-md ${
            result.success
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="font-semibold text-sm text-gray-300 mb-2 capitalize">
            {cat}
          </h3>
          <div className="space-y-2">
            {defaultMaterials
              .filter((m) => m.category === cat)
              .map((m) => {
                const key = `${m.category}-${m.materialType}`;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm">{formatName(m.materialType)}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        (default: ${m.costPerUnit}/{m.unit})
                      </span>
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={m.costPerUnit.toString()}
                        value={prices[key]}
                        onChange={(e) =>
                          setPrices((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="text-right text-sm"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Pricing"}
      </Button>
    </div>
  );
}
