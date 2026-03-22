"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Receipt, Loader2, Trash2, DollarSign } from "lucide-react";

interface ReceiptItem {
  description: string;
  amount: number;
  category: string;
}

interface ReceiptRecord {
  id: string;
  jobId: string | null;
  store: string | null;
  receiptDate: string | null;
  items: ReceiptItem[] | null;
  total: number;
  category: string;
  notes: string | null;
  createdAt: string;
  job?: { id: string; quote: { projectName: string | null } } | null;
}

interface Job {
  id: string;
  quote: { projectName: string | null };
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for saving scan result
  const [saveJobId, setSaveJobId] = useState("");
  const [saveNotes, setSaveNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [receiptsRes, jobsRes] = await Promise.all([
      fetch("/api/receipts"),
      fetch("/api/jobs"),
    ]);
    const receiptsData = await receiptsRes.json();
    const jobsData = await jobsRes.json();
    if (Array.isArray(receiptsData)) setReceipts(receiptsData);
    if (Array.isArray(jobsData)) setJobs(jobsData);
    setLoading(false);
  }

  async function handleCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanResult(null);

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
          setScanResult(data);
          setShowCamera(false);
        } else {
          const err = await res.json();
          alert(err.error || "Scan failed");
        }
      } catch {
        alert("Failed to scan receipt");
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  }

  async function saveReceipt() {
    if (!scanResult) return;
    setSaving(true);

    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: saveJobId || undefined,
          store: scanResult.store || undefined,
          receiptDate: scanResult.date || undefined,
          items: scanResult.items || undefined,
          subtotal: scanResult.subtotal,
          tax: scanResult.tax,
          total: scanResult.total,
          notes: saveNotes || undefined,
        }),
      });

      if (res.ok) {
        setScanResult(null);
        setSaveJobId("");
        setSaveNotes("");
        await loadData();
      }
    } catch {
      alert("Failed to save");
    }
    setSaving(false);
  }

  async function deleteReceipt(id: string) {
    await fetch(`/api/receipts?id=${id}`, { method: "DELETE" });
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  }

  const totalSpend = receipts.reduce((sum, r) => sum + r.total, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <Button onClick={() => fileInputRef.current?.click()} size="sm">
          <Camera className="mr-1.5 h-4 w-4" />
          Scan Receipt
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCapture}
        />
      </div>

      {/* Scanning indicator */}
      {scanning && (
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-3 font-medium">Scanning receipt with AI...</p>
            <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
          </CardContent>
        </Card>
      )}

      {/* Scan result */}
      {scanResult && (
        <Card className="border-green-500/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Scanned Receipt
              {scanResult.store && ` — ${scanResult.store}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResult.items && scanResult.items.length > 0 && (
              <div className="space-y-1">
                {scanResult.items.map((item: ReceiptItem, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{item.description}</span>
                    <span className="font-mono">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  {scanResult.subtotal && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${scanResult.subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {scanResult.tax > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>${scanResult.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${scanResult.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Link to Job</label>
                <select
                  value={saveJobId}
                  onChange={(e) => setSaveJobId(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">No job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.quote?.projectName || "Untitled Job"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <input
                  value={saveNotes}
                  onChange={(e) => setSaveNotes(e.target.value)}
                  placeholder="Optional notes"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveReceipt} disabled={saving}>
                {saving ? "Saving..." : "Save Receipt"}
              </Button>
              <Button onClick={() => setScanResult(null)} variant="ghost">
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{receipts.length}</p>
            <p className="text-sm text-muted-foreground">Total Receipts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">${totalSpend.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Total Spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Receipt list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Saved Receipts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No receipts yet. Tap &ldquo;Scan Receipt&rdquo; to capture one with your camera.
            </p>
          ) : (
            <div className="space-y-2">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {receipt.store || "Unknown Store"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {receipt.receiptDate
                          ? new Date(receipt.receiptDate).toLocaleDateString()
                          : new Date(receipt.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {receipt.category}
                      </Badge>
                      {receipt.job?.quote?.projectName && (
                        <Badge variant="outline" className="text-xs">
                          {receipt.job.quote.projectName}
                        </Badge>
                      )}
                      {receipt.notes && (
                        <span className="text-xs text-muted-foreground truncate">
                          {receipt.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-bold">${receipt.total.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReceipt(receipt.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
