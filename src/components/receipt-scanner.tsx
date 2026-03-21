"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReceiptItem {
  description: string;
  amount: number;
  category: "materials" | "labor" | "other";
}

interface ReceiptResult {
  store: string;
  date: string | null;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface ReceiptScannerProps {
  jobId: string;
  onApply?: (items: ReceiptItem[]) => void;
}

export function ReceiptScanner({ jobId, onApply }: ReceiptScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/receipts/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        } else {
          const data = await res.json();
          setError(data.error || "Scan failed");
        }
      } catch {
        setError("Failed to scan receipt");
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveAsActualCosts() {
    if (!result) return;
    setSaving(true);
    try {
      for (const item of result.items) {
        await fetch("/api/jobs/" + jobId, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cost",
            description: item.description,
            amount: item.amount,
            category: item.category,
          }),
        });
      }
      if (onApply) onApply(result.items);
    } catch {
      setError("Failed to save costs");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
        >
          {scanning ? "Scanning..." : "Scan Receipt"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {result.store} {result.date && `- ${result.date}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              {result.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.description}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({item.category})
                    </span>
                  </span>
                  <span className="font-mono">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-medium">
              <span>Total</span>
              <span className="font-mono">${result.total.toFixed(2)}</span>
            </div>
            <Button
              size="sm"
              onClick={saveAsActualCosts}
              disabled={saving}
              className="w-full mt-2"
            >
              {saving ? "Saving..." : "Add to Job Costs"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
