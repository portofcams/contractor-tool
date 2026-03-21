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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface Room {
  name: string;
  lengthFt: number;
  widthFt: number;
  sqft: number;
}

interface AIEstimateResult {
  rooms: Room[];
  materials: MaterialLine[];
  notes: string;
  confidence: "high" | "medium" | "low";
}

interface AIEstimateProps {
  trade: string;
  onApply: (materials: MaterialLine[], rooms: Room[]) => void;
}

export function AIEstimate({ trade, onApply }: AIEstimateProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<AIEstimateResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Back-compat: single preview getter
  const preview = previews.length > 0 ? previews[0] : null;

  async function capturePhoto() {
    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Prompt,
          width: 1200,
          height: 1200,
        });
        if (photo.base64String) {
          const dataUrl = `data:image/${photo.format};base64,${photo.base64String}`;
          setPreviews((prev) => [...prev, dataUrl]);
        }
      } catch {
        // User cancelled
      }
    } else {
      fileRef.current?.click();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function analyze() {
    if (previews.length === 0) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/quotes/ai-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: previews,
          trade,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Analysis failed");
        setLoading(false);
        return;
      }

      const data: AIEstimateResult = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  function applyEstimate() {
    if (!result) return;
    onApply(result.materials, result.rooms);
    setOpen(false);
    setResult(null);
    setPreviews([]);
    setNotes("");
  }

  const confidenceColor =
    result?.confidence === "high"
      ? "text-green-400"
      : result?.confidence === "medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
        AI Estimate from Photo
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Room Estimate</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {previews.length === 0 ? (
              <button
                onClick={capturePhoto}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-secondary/50 transition-colors"
              >
                <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  Take photos or upload images of rooms (up to 10)
                </span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((p, i) => (
                    <div key={i} className="relative">
                      <img
                        src={p}
                        alt={`Room photo ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => { removePhoto(i); setResult(null); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                {previews.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={capturePhoto}
                  >
                    + Add Photo ({previews.length}/10)
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="ai-notes">Additional notes (optional)</Label>
              <Input
                id="ai-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'need premium hardwood', 'ceiling is 10ft'"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {!result && (
              <Button
                onClick={analyze}
                disabled={previews.length === 0 || loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                    </svg>
                    Analyzing room...
                  </span>
                ) : (
                  "Analyze Photo"
                )}
              </Button>
            )}

            {result && (
              <div className="space-y-4">
                {/* Confidence */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className={`font-medium capitalize ${confidenceColor}`}>
                    {result.confidence}
                  </span>
                </div>

                {/* Rooms */}
                {result.rooms.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Detected Rooms
                    </p>
                    <div className="space-y-1">
                      {result.rooms.map((room, i) => (
                        <div key={i} className="flex justify-between text-sm bg-secondary/50 p-2 rounded">
                          <span>{room.name}</span>
                          <span className="text-muted-foreground">
                            {room.lengthFt}&apos; x {room.widthFt}&apos; = {room.sqft} sqft
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Estimated Materials
                  </p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left p-2 font-medium text-xs">Item</th>
                          <th className="text-right p-2 font-medium text-xs">Qty</th>
                          <th className="text-right p-2 font-medium text-xs">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.materials.map((m, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="p-2">{m.item}</td>
                            <td className="text-right p-2 text-muted-foreground">
                              {m.qty} {m.unit}
                            </td>
                            <td className="text-right p-2">${m.cost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-primary/30">
                          <td className="p-2 font-bold" colSpan={2}>Total</td>
                          <td className="text-right p-2 font-bold text-primary">
                            ${result.materials.reduce((s, m) => s + m.cost, 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {result.notes && (
                  <div className="bg-primary/8 text-blue-300 text-xs p-3 rounded-md">
                    <span className="font-medium">AI Notes:</span> {result.notes}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={applyEstimate} className="flex-1">
                    Use This Estimate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setResult(null); setPreviews([]); }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
