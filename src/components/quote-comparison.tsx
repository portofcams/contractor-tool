"use client";

import { useState, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompetitorItem {
  description: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  total: number;
}

interface CompetitorQuote {
  companyName: string | null;
  quoteDate: string | null;
  items: CompetitorItem[];
  subtotal: number | null;
  tax: number | null;
  total: number;
  notes: string;
}

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface QuoteComparisonProps {
  myMaterials?: MaterialLine[];
  onCreateCounterQuote?: (items: MaterialLine[]) => void;
}

export function QuoteComparison({
  myMaterials,
  onCreateCounterQuote,
}: QuoteComparisonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CompetitorQuote | null>(null);
  const [error, setError] = useState("");
  const [beatPercent, setBeatPercent] = useState(5);
  const fileRef = useRef<HTMLInputElement>(null);

  async function capturePhoto() {
    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Prompt,
          width: 1600,
          height: 2000,
        });
        if (photo.base64String) {
          const dataUrl = `data:image/${photo.format};base64,${photo.base64String}`;
          setPreview(dataUrl);
        }
      } catch {
        // User cancelled
      }
    } else {
      fileRef.current?.click();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!preview) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/quotes/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Analysis failed");
        setLoading(false);
        return;
      }

      const data: CompetitorQuote = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  function generateCounterQuote() {
    if (!result || !onCreateCounterQuote) return;
    const discountMultiplier = 1 - beatPercent / 100;
    const counterItems: MaterialLine[] = result.items.map((item) => ({
      item: item.description,
      qty: item.quantity || 1,
      unit: item.unit || "unit",
      unitCost: (item.unitPrice || item.total) * discountMultiplier,
      cost: item.total * discountMultiplier,
    }));
    onCreateCounterQuote(counterItems);
    setOpen(false);
  }

  // Match competitor items against your materials
  function getMyPrice(description: string): number | null {
    if (!myMaterials) return null;
    const desc = description.toLowerCase();
    const match = myMaterials.find(
      (m) =>
        desc.includes(m.item.toLowerCase()) ||
        m.item.toLowerCase().includes(desc.split(" ")[0])
    );
    return match ? match.cost : null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
        Compare to Competitor
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Competitor Quote Comparison</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!preview ? (
              <button
                onClick={capturePhoto}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-secondary/50 transition-colors"
              >
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">
                  Take a photo of the competitor&apos;s quote
                </span>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Competitor quote"
                  className="w-full max-h-48 object-contain rounded-lg bg-secondary"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white text-sm hover:bg-black/80"
                >
                  X
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {preview && !result && (
              <Button onClick={analyze} disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        fill="currentColor"
                        className="opacity-75"
                      />
                    </svg>
                    Extracting quote details...
                  </span>
                ) : (
                  "Extract & Compare"
                )}
              </Button>
            )}

            {result && (
              <div className="space-y-4">
                {/* Competitor info */}
                {result.companyName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Competitor</span>
                    <span className="font-medium">{result.companyName}</span>
                  </div>
                )}

                {/* Comparison table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-2 font-medium text-xs">
                          Item
                        </th>
                        <th className="text-right p-2 font-medium text-xs">
                          Their Price
                        </th>
                        {myMaterials && (
                          <th className="text-right p-2 font-medium text-xs">
                            Your Price
                          </th>
                        )}
                        {myMaterials && (
                          <th className="text-right p-2 font-medium text-xs">
                            Diff
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((item, i) => {
                        const myPrice = getMyPrice(item.description);
                        const diff =
                          myPrice !== null ? myPrice - item.total : null;
                        return (
                          <tr key={i} className="border-t border-border">
                            <td className="p-2">
                              {item.description}
                              {item.quantity && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({item.quantity} {item.unit})
                                </span>
                              )}
                            </td>
                            <td className="text-right p-2">
                              ${item.total.toFixed(2)}
                            </td>
                            {myMaterials && (
                              <td className="text-right p-2">
                                {myPrice !== null
                                  ? `$${myPrice.toFixed(2)}`
                                  : "—"}
                              </td>
                            )}
                            {myMaterials && (
                              <td
                                className={`text-right p-2 font-medium ${
                                  diff === null
                                    ? ""
                                    : diff < 0
                                    ? "text-green-400"
                                    : diff > 0
                                    ? "text-red-400"
                                    : ""
                                }`}
                              >
                                {diff !== null
                                  ? `${diff > 0 ? "+" : ""}$${diff.toFixed(2)}`
                                  : "—"}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border font-bold">
                        <td className="p-2">Total</td>
                        <td className="text-right p-2">
                          ${result.total.toFixed(2)}
                        </td>
                        {myMaterials && (
                          <td className="text-right p-2">
                            $
                            {myMaterials
                              .reduce((s, m) => s + m.cost, 0)
                              .toFixed(2)}
                          </td>
                        )}
                        {myMaterials && <td />}
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {result.notes && (
                  <div className="bg-primary/8 text-blue-300 text-xs p-3 rounded-md">
                    <span className="font-medium">Notes:</span> {result.notes}
                  </div>
                )}

                {/* Beat by X% */}
                {onCreateCounterQuote && (
                  <div className="space-y-3 border border-border rounded-lg p-3">
                    <p className="text-sm font-medium">
                      Generate Counter-Quote
                    </p>
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="beat-percent"
                        className="text-sm text-muted-foreground"
                      >
                        Beat by
                      </label>
                      <input
                        id="beat-percent"
                        type="range"
                        min="1"
                        max="30"
                        value={beatPercent}
                        onChange={(e) =>
                          setBeatPercent(Number(e.target.value))
                        }
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-10 text-right">
                        {beatPercent}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your counter-quote total: $
                      {(result.total * (1 - beatPercent / 100)).toFixed(2)}
                    </p>
                    <Button onClick={generateCounterQuote} className="w-full">
                      Create Counter-Quote at{" "}
                      ${(result.total * (1 - beatPercent / 100)).toFixed(2)}
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setPreview(null);
                  }}
                  className="w-full"
                >
                  Compare Another
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
