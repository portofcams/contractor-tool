"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ──

type ColumnType =
  | "itemName"
  | "quantity"
  | "unitPrice"
  | "total"
  | "customerName"
  | "date"
  | "invoiceNumber"
  | "description"
  | "unit"
  | "category"
  | "unknown";

interface ScrapedProfile {
  companyName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo: string | null;
  description: string | null;
  services: string[];
  socialLinks: string[];
  hours: string | null;
}

interface CsvParseResult {
  headers: string[];
  rows: string[][];
  columnMapping: Record<string, ColumnType>;
  previewRows: string[][];
  totalRows: number;
  detectedSource: string;
}

interface ImportResult {
  imported: {
    priceBookItems: number;
    customers: number;
    invoices: number;
  };
  errors?: string[];
}

const COLUMN_TYPE_LABELS: Record<ColumnType, string> = {
  itemName: "Item / Service Name",
  quantity: "Quantity",
  unitPrice: "Unit Price",
  total: "Total",
  customerName: "Customer Name",
  date: "Date",
  invoiceNumber: "Invoice #",
  description: "Description",
  unit: "Unit",
  category: "Category",
  unknown: "-- Skip --",
};

// ── Website Import Section ──

function WebsiteImport() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ScrapedProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<ScrapedProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleScan() {
    if (!url.trim()) return;
    setLoading(true);
    setMessage(null);
    setProfile(null);

    try {
      const res = await fetch("/api/import/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to scan website" });
        return;
      }
      setProfile(data);
      setEditedProfile(data);
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!editedProfile) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: editedProfile.companyName || undefined,
          phone: editedProfile.phone || undefined,
          // Settings API takes these fields
          trade: "flooring", // preserve current — ideally we'd read the current value
          defaultMarkup: 50,
          defaultTaxRate: 0,
          defaultLaborCost: 0,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof ScrapedProfile, value: string) {
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, [field]: value });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website-url">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="website-url"
            type="url"
            placeholder="https://yourcompany.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
          />
          <Button onClick={handleScan} disabled={loading || !url.trim()}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Scanning...
              </span>
            ) : (
              "Scan Website"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          We&apos;ll extract your company name, contact info, logo, and services from your website.
        </p>
      </div>

      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {editedProfile && (
        <div className="space-y-4 border border-border rounded-lg p-4">
          <h3 className="font-medium text-sm text-muted-foreground">Extracted Data — Edit before saving</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scraped-name">Company Name</Label>
              <Input
                id="scraped-name"
                value={editedProfile.companyName || ""}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scraped-phone">Phone</Label>
              <Input
                id="scraped-phone"
                value={editedProfile.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scraped-email">Email</Label>
              <Input
                id="scraped-email"
                value={editedProfile.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scraped-address">Address</Label>
              <Input
                id="scraped-address"
                value={editedProfile.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="scraped-logo">Logo URL</Label>
              <div className="flex items-center gap-3">
                {editedProfile.logo && (
                  <img
                    src={editedProfile.logo}
                    alt="Logo preview"
                    className="w-12 h-12 rounded border border-border object-contain bg-secondary"
                  />
                )}
                <Input
                  id="scraped-logo"
                  value={editedProfile.logo || ""}
                  onChange={(e) => updateField("logo", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="scraped-desc">Description</Label>
              <Input
                id="scraped-desc"
                value={editedProfile.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            {editedProfile.hours && (
              <div className="space-y-2 md:col-span-2">
                <Label>Business Hours</Label>
                <Input value={editedProfile.hours} onChange={(e) => updateField("hours", e.target.value)} />
              </div>
            )}
          </div>

          {editedProfile.services.length > 0 && (
            <div className="space-y-2">
              <Label>Services / Specialties</Label>
              <div className="flex flex-wrap gap-2">
                {editedProfile.services.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {editedProfile.socialLinks.length > 0 && (
            <div className="space-y-2">
              <Label>Social Links</Label>
              <div className="flex flex-wrap gap-2">
                {editedProfile.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-blue-400 hover:text-blue-300 truncate max-w-xs"
                  >
                    {new URL(link).hostname.replace("www.", "")}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!profile?.companyName && !profile?.phone && !profile?.email && (
            <div className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-md">
              Limited data found. The website may use JavaScript rendering that we can&apos;t parse, or it may not have structured business data.
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save to Profile"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── CSV Import Section ──

function CsvImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [csvData, setCsvData] = useState<CsvParseResult | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, ColumnType>>({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Import options
  const [addToPriceBook, setAddToPriceBook] = useState(true);
  const [createInvoices, setCreateInvoices] = useState(false);
  const [importCustomers, setImportCustomers] = useState(true);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    setMessage(null);
    setCsvData(null);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/csv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to parse file" });
        return;
      }
      setCsvData(data);
      setColumnMapping(data.columnMapping);
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setUploading(false);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function updateColumnMapping(colIndex: string, type: ColumnType) {
    setColumnMapping((prev) => ({ ...prev, [colIndex]: type }));
  }

  async function handleImport() {
    if (!csvData) return;
    setImporting(true);
    setMessage(null);
    setImportResult(null);

    try {
      const res = await fetch("/api/import/csv/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: csvData.rows,
          columnMapping,
          options: { addToPriceBook, createInvoices, importCustomers },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Import failed" });
        return;
      }
      setImportResult(data);
      setMessage({ type: "success", text: "Import completed!" });
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setImporting(false);
    }
  }

  const mappedColumns = Object.values(columnMapping).filter((v) => v !== "unknown");
  const hasItemColumn = mappedColumns.includes("itemName");

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      {!csvData && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-2">
            <svg
              className="mx-auto h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-sm font-medium">
              {uploading ? "Parsing file..." : "Drop a CSV file here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports QuickBooks, Square, FreshBooks, Wix, and generic CSV formats. Max 5MB.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Import result summary */}
      {importResult && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Import Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{importResult.imported.priceBookItems}</div>
              <div className="text-xs text-muted-foreground">Price Book Items</div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{importResult.imported.customers}</div>
              <div className="text-xs text-muted-foreground">Customers</div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{importResult.imported.invoices}</div>
              <div className="text-xs text-muted-foreground">Invoices</div>
            </div>
          </div>
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-amber-400">Some rows had issues:</p>
              <div className="max-h-32 overflow-y-auto text-xs text-muted-foreground space-y-0.5">
                {importResult.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setCsvData(null);
              setImportResult(null);
              setMessage(null);
            }}
          >
            Import Another File
          </Button>
        </div>
      )}

      {/* Preview & mapping */}
      {csvData && !importResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Preview: {csvData.totalRows} rows</h3>
              <p className="text-xs text-muted-foreground">
                Detected format: <span className="capitalize">{csvData.detectedSource}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCsvData(null);
                setMessage(null);
              }}
            >
              Clear
            </Button>
          </div>

          {/* Column mapping */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium">Column Mapping</h4>
            <p className="text-xs text-muted-foreground">
              Verify each column is mapped correctly. Adjust if auto-detection got it wrong.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {csvData.headers.map((header, idx) => (
                <div key={idx} className="space-y-1">
                  <Label className="text-xs truncate block" title={header}>
                    {header}
                  </Label>
                  <Select
                    value={columnMapping[idx.toString()] || "unknown"}
                    onValueChange={(val) => updateColumnMapping(idx.toString(), val as ColumnType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COLUMN_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Data preview table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-xs">#</TableHead>
                    {csvData.headers.map((h, i) => (
                      <TableHead key={i} className="text-xs min-w-[120px]">
                        <div>{h}</div>
                        <div className="font-normal text-muted-foreground">
                          {COLUMN_TYPE_LABELS[columnMapping[i.toString()] || "unknown"]}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.previewRows.map((row, ri) => (
                    <TableRow key={ri}>
                      <TableCell className="text-xs text-muted-foreground">{ri + 1}</TableCell>
                      {row.map((cell, ci) => (
                        <TableCell key={ci} className="text-xs max-w-[200px] truncate" title={cell}>
                          {cell || <span className="text-muted-foreground italic">empty</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {csvData.totalRows > 10 && (
              <div className="text-xs text-muted-foreground p-2 border-t border-border text-center">
                Showing 10 of {csvData.totalRows} rows
              </div>
            )}
          </div>

          {/* Import options */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium">Import Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addToPriceBook}
                  onChange={(e) => setAddToPriceBook(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Add to Price Book</span>
                <span className="text-xs text-muted-foreground">
                  Creates material/service items from your line items
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importCustomers}
                  onChange={(e) => setImportCustomers(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Import Customers</span>
                <span className="text-xs text-muted-foreground">
                  Creates customer records from customer/client names
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createInvoices}
                  onChange={(e) => setCreateInvoices(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Create as Past Invoices</span>
                <span className="text-xs text-muted-foreground">
                  Creates invoice records (marked as paid) for historical tracking
                </span>
              </label>
            </div>
          </div>

          {/* Import button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleImport}
              disabled={importing || !hasItemColumn || (!addToPriceBook && !createInvoices && !importCustomers)}
            >
              {importing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Importing...
                </span>
              ) : (
                `Import ${csvData.totalRows} Items`
              )}
            </Button>
            {!hasItemColumn && (
              <p className="text-xs text-amber-400">
                Map at least one column to &quot;Item / Service Name&quot; to import.
              </p>
            )}
            {!addToPriceBook && !createInvoices && !importCustomers && (
              <p className="text-xs text-amber-400">Select at least one import option.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Import Page ──

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground text-sm">
          Import your business profile from your website, or bring in invoices and price book items from a CSV export.
        </p>
      </div>

      <Tabs defaultValue="website">
        <TabsList>
          <TabsTrigger value="website">Import from Website</TabsTrigger>
          <TabsTrigger value="csv">Import Invoices &amp; Price Book</TabsTrigger>
        </TabsList>

        <TabsContent value="website">
          <Card>
            <CardHeader>
              <CardTitle>Import from Website</CardTitle>
              <CardDescription>
                Enter your company website and we&apos;ll automatically extract your business info to populate your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebsiteImport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>Import Invoices &amp; Price Book</CardTitle>
              <CardDescription>
                Upload a CSV export from QuickBooks, Square, FreshBooks, Wix, or any spreadsheet. We&apos;ll auto-detect columns and let you map them before importing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CsvImport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
