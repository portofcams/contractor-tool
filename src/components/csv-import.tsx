"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CSVImport() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    imported?: number;
    skipped?: number;
    total?: number;
    error?: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport(file: File) {
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/customers/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          imported: data.imported,
          skipped: data.skipped,
          total: data.total,
        });
        router.refresh();
      } else {
        setResult({ error: data.error || "Import failed" });
      }
    } catch {
      setResult({ error: "Network error" });
    }
    setUploading(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setResult(null);
          setOpen(true);
        }}
      >
        Import CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Customers from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with columns: <strong>name</strong>, email, phone, address, notes.
              The first row should be column headers.
            </p>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImport(f);
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Importing..." : "Choose CSV File"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Max 5MB</p>
            </div>

            {result && (
              <div
                className={`text-sm p-3 rounded-md ${
                  result.error
                    ? "bg-red-500/10 text-red-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {result.error ? (
                  result.error
                ) : (
                  <>
                    Imported <strong>{result.imported}</strong> customers
                    {result.skipped! > 0 && (
                      <>, skipped {result.skipped} duplicates</>
                    )}
                    {" "}(out of {result.total} rows)
                  </>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Example CSV:</p>
              <pre className="bg-secondary p-2 rounded text-xs overflow-x-auto">
{`name,email,phone,address
John Smith,john@example.com,555-0123,"123 Main St"
Jane Doe,jane@example.com,555-0456,"456 Oak Ave"`}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
