"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ── Types ──

interface PriceBookItem {
  id: string;
  name: string;
  category: string;
  materialType: string;
  itemType: "material" | "labor" | "misc";
  unit: string;
  costPerUnit: number;
  wasteFactor: number;
  defaultQty: number | null;
  sortOrder: number;
}

interface LineItem {
  id: string;
  priceBookId: string;
  name: string;
  itemType: "material" | "labor" | "misc";
  unit: string;
  unitCost: number;
  wasteFactor: number;
  rawQty: number;
  adjustedQty: number;
  lineTotal: number;
  manualQty: boolean;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface DraftState {
  projectName: string;
  customerId: string;
  address: string;
  sqft: number;
  notes: string;
  taxRate: number;
  lineItems: LineItem[];
  savedAt: number;
  savedQuoteId?: string; // ID of the server-side draft quote
}

// ── Constants ──

const DRAFT_KEY = "contractorcalc_estimate_draft";
const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

// ── Helpers ──

function calcLineItem(item: LineItem, sqft: number): LineItem {
  if (item.manualQty) {
    return { ...item, lineTotal: item.rawQty * item.unitCost };
  }
  const rawQty = sqft;
  const adjustedQty =
    item.itemType === "material" && item.wasteFactor > 0
      ? Math.ceil(rawQty * (1 + item.wasteFactor))
      : rawQty;
  return {
    ...item,
    rawQty,
    adjustedQty,
    lineTotal: adjustedQty * item.unitCost,
  };
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function hasMeaningfulContent(draft: DraftState): boolean {
  return !!(
    draft.projectName ||
    draft.address ||
    draft.sqft > 0 ||
    draft.notes ||
    draft.lineItems.length > 0
  );
}

let lineIdCounter = 0;

// ── Component ──

export default function NewEstimatePage() {
  const router = useRouter();

  // Header fields
  const [projectName, setProjectName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const [sqft, setSqft] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  // Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [priceBook, setPriceBook] = useState<PriceBookItem[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved" | "offline" | "restored">("");
  const [isOnline, setIsOnline] = useState(true);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSaveRef = useRef<string>(""); // JSON of last saved state to avoid duplicate saves
  const initialLoadDone = useRef(false);

  // Picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  // Inline customer add
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");

  // ── Draft state builder ──
  const buildDraftState = useCallback((): DraftState => ({
    projectName,
    customerId,
    address,
    sqft,
    notes,
    taxRate,
    lineItems,
    savedAt: Date.now(),
    savedQuoteId: savedQuoteId || undefined,
  }), [projectName, customerId, address, sqft, notes, taxRate, lineItems, savedQuoteId]);

  // ── Save to localStorage (instant, every change) ──
  useEffect(() => {
    if (!initialLoadDone.current) return;
    const draft = buildDraftState();
    if (hasMeaningfulContent(draft)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasUnsavedChanges(true);
    }
  }, [projectName, customerId, address, sqft, notes, taxRate, lineItems, buildDraftState]);

  // ── Online/offline detection ──
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus("");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus("offline");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── Unsaved changes warning ──
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && hasMeaningfulContent(buildDraftState())) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, buildDraftState]);

  // ── Server auto-save every 30s ──
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isOnline || !customerId) return;

      const draft = buildDraftState();
      if (!hasMeaningfulContent(draft)) return;
      if (draft.lineItems.length === 0) return;

      // Skip if nothing changed since last save
      const stateKey = JSON.stringify({
        projectName: draft.projectName,
        customerId: draft.customerId,
        address: draft.address,
        sqft: draft.sqft,
        notes: draft.notes,
        taxRate: draft.taxRate,
        lineItems: draft.lineItems.map(i => ({ id: i.priceBookId, qty: i.rawQty, cost: i.unitCost })),
      });
      if (stateKey === lastSaveRef.current) return;

      setSaveStatus("saving");

      const materials = draft.lineItems.map((item) => ({
        item: item.name,
        qty: item.adjustedQty,
        unit: item.unit,
        unitCost: item.unitCost,
        cost: item.lineTotal,
      }));

      const matTotal = draft.lineItems.filter(i => i.itemType === "material").reduce((s, i) => s + i.lineTotal, 0);
      const labTotal = draft.lineItems.filter(i => i.itemType === "labor").reduce((s, i) => s + i.lineTotal, 0);
      const mscTotal = draft.lineItems.filter(i => i.itemType === "misc").reduce((s, i) => s + i.lineTotal, 0);
      const sub = matTotal + labTotal + mscTotal;
      const tax = sub * (draft.taxRate / 100);

      const payload = {
        customerId: draft.customerId,
        trade: "flooring" as const,
        materials,
        subtotal: matTotal + mscTotal,
        laborCost: labTotal,
        markupPercent: 0,
        taxRate: draft.taxRate,
        total: sub + tax,
        projectName: draft.projectName || undefined,
        address: draft.address || undefined,
        sqft: draft.sqft || undefined,
        notes: draft.notes || undefined,
      };

      try {
        let res: Response;
        if (savedQuoteId) {
          // Update existing draft
          res = await fetch(`/api/quotes/${savedQuoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          // Create new draft
          res = await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (res.ok) {
          const quote = await res.json();
          if (!savedQuoteId) {
            setSavedQuoteId(quote.id);
          }
          lastSaveRef.current = stateKey;
          setHasUnsavedChanges(false);
          setSaveStatus("saved");
          // Update localStorage with quote ID
          const updatedDraft = { ...draft, savedQuoteId: quote.id };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDraft));
          setTimeout(() => setSaveStatus(""), 3000);
        } else {
          setSaveStatus("offline");
        }
      } catch {
        setSaveStatus("offline");
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isOnline, customerId, buildDraftState, savedQuoteId]);

  // ── Load data + restore draft on mount ──
  useEffect(() => {
    Promise.all([
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/price-book").then((r) => r.json()),
      fetch("/api/usage").then((r) => r.json()),
    ]).then(([custs, pb, usage]) => {
      setCustomers(Array.isArray(custs) ? custs : []);
      setPriceBook(Array.isArray(pb) ? pb : []);
      if (usage?.defaults?.taxRate) setTaxRate(usage.defaults.taxRate);

      // Restore draft from localStorage
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          const draft: DraftState = JSON.parse(saved);
          // Only restore if less than 24 hours old
          if (Date.now() - draft.savedAt < 24 * 60 * 60 * 1000 && hasMeaningfulContent(draft)) {
            setProjectName(draft.projectName || "");
            setCustomerId(draft.customerId || "");
            setAddress(draft.address || "");
            setSqft(draft.sqft || 0);
            setNotes(draft.notes || "");
            setTaxRate(draft.taxRate || 0);
            setLineItems(draft.lineItems || []);
            if (draft.savedQuoteId) setSavedQuoteId(draft.savedQuoteId);
            // Update lineIdCounter to avoid collisions
            lineIdCounter = draft.lineItems.length + 10;
            setSaveStatus("restored");
            setTimeout(() => setSaveStatus(""), 4000);
          }
        }
      } catch {
        // Ignore corrupt localStorage
      }

      initialLoadDone.current = true;
      setLoading(false);
    });
  }, []);

  // Recalculate all line items when sqft changes
  useEffect(() => {
    if (!initialLoadDone.current) return;
    setLineItems((prev) => prev.map((item) => calcLineItem(item, sqft)));
  }, [sqft]);

  // Add a price book item as a line item
  function addLineItem(pbItem: PriceBookItem) {
    const isManual = pbItem.unit === "ea" || pbItem.unit === "lf" || pbItem.unit === "hr";
    const rawQty = isManual ? (pbItem.defaultQty || 1) : sqft;
    const adjustedQty =
      !isManual && pbItem.itemType === "material" && pbItem.wasteFactor > 0
        ? Math.ceil(rawQty * (1 + pbItem.wasteFactor))
        : rawQty;

    const newLine: LineItem = {
      id: `line-${++lineIdCounter}`,
      priceBookId: pbItem.id,
      name: pbItem.name,
      itemType: pbItem.itemType,
      unit: pbItem.unit,
      unitCost: pbItem.costPerUnit,
      wasteFactor: pbItem.wasteFactor,
      rawQty,
      adjustedQty,
      lineTotal: adjustedQty * pbItem.costPerUnit,
      manualQty: isManual,
    };

    setLineItems((prev) => [...prev, newLine]);
    setPickerOpen(false);
    setPickerSearch("");
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateLineQty(id: string, qty: number) {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, rawQty: qty, adjustedQty: qty };
        updated.lineTotal = qty * item.unitCost;
        return updated;
      })
    );
  }

  function updateLineRate(id: string, rate: number) {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, unitCost: rate, lineTotal: item.adjustedQty * rate };
      })
    );
  }

  // Totals
  const materialTotal = useMemo(
    () => lineItems.filter((i) => i.itemType === "material").reduce((sum, i) => sum + i.lineTotal, 0),
    [lineItems]
  );
  const laborTotal = useMemo(
    () => lineItems.filter((i) => i.itemType === "labor").reduce((sum, i) => sum + i.lineTotal, 0),
    [lineItems]
  );
  const miscTotal = useMemo(
    () => lineItems.filter((i) => i.itemType === "misc").reduce((sum, i) => sum + i.lineTotal, 0),
    [lineItems]
  );
  const subtotal = materialTotal + laborTotal + miscTotal;
  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxAmount;

  // Create inline customer
  async function createCustomer() {
    if (!newCustName.trim()) return;
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCustName, email: newCustEmail || undefined, phone: newCustPhone || undefined }),
    });
    if (res.ok) {
      const cust = await res.json();
      setCustomers((prev) => [cust, ...prev]);
      setCustomerId(cust.id);
      setShowNewCustomer(false);
      setNewCustName("");
      setNewCustEmail("");
      setNewCustPhone("");
    }
  }

  // Clear draft after successful submit
  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setHasUnsavedChanges(false);
  }

  // Submit estimate as Quote
  async function submitEstimate(sendNow: boolean) {
    if (!customerId) {
      setError("Please select or add a customer.");
      return;
    }
    if (lineItems.length === 0) {
      setError("Add at least one line item.");
      return;
    }

    setSubmitting(true);
    setError("");

    const materials = lineItems.map((item) => ({
      item: item.name,
      qty: item.adjustedQty,
      unit: item.unit,
      unitCost: item.unitCost,
      cost: item.lineTotal,
    }));

    const payload = {
      customerId,
      trade: "flooring" as const,
      materials,
      subtotal: materialTotal + miscTotal,
      laborCost: laborTotal,
      markupPercent: 0,
      taxRate,
      total: grandTotal,
      projectName: projectName || undefined,
      address: address || undefined,
      sqft: sqft || undefined,
      notes: notes || undefined,
    };

    try {
      let res: Response;
      if (savedQuoteId) {
        // Update existing auto-saved draft
        res = await fetch(`/api/quotes/${savedQuoteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        // If offline, save to localStorage for later
        if (!navigator.onLine) {
          localStorage.setItem(DRAFT_KEY + "_pending", JSON.stringify(payload));
          setError("Saved locally — will sync when back online.");
          setSaveStatus("offline");
          setSubmitting(false);
          return;
        }
        setError(err.error || "Failed to create estimate");
        setSubmitting(false);
        return;
      }

      const quote = await res.json();

      if (sendNow && quote.id) {
        await fetch(`/api/quotes/${quote.id}/send`, { method: "POST" });
      }

      clearDraft();
      router.push(`/quotes/${quote.id}`);
    } catch {
      // Network error — save locally
      localStorage.setItem(DRAFT_KEY + "_pending", JSON.stringify(payload));
      setError("No connection. Estimate saved locally — will sync when back online.");
      setSaveStatus("offline");
      setSubmitting(false);
    }
  }

  // ── Sync pending offline saves when back online ──
  useEffect(() => {
    if (!isOnline) return;
    const pending = localStorage.getItem(DRAFT_KEY + "_pending");
    if (!pending) return;

    (async () => {
      try {
        const payload = JSON.parse(pending);
        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          localStorage.removeItem(DRAFT_KEY + "_pending");
          clearDraft();
          const quote = await res.json();
          setSaveStatus("saved");
          setTimeout(() => {
            router.push(`/quotes/${quote.id}`);
          }, 1000);
        }
      } catch {
        // Still offline, will retry next time
      }
    })();
  }, [isOnline, router]);

  // Start new estimate (clear draft)
  function startNew() {
    if (!confirm("Clear current estimate and start fresh?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setProjectName("");
    setCustomerId("");
    setAddress("");
    setSqft(0);
    setNotes("");
    setLineItems([]);
    setSavedQuoteId(null);
    setHasUnsavedChanges(false);
    setSaveStatus("");
    lastSaveRef.current = "";
  }

  // Picker filtered items
  const filteredPB = pickerSearch
    ? priceBook.filter((i) => i.name.toLowerCase().includes(pickerSearch.toLowerCase()))
    : priceBook;

  const pickerGroups = useMemo(() => {
    const groups: Record<string, PriceBookItem[]> = {};
    for (const item of filteredPB) {
      const key = `${item.category} - ${item.itemType}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [filteredPB]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">New Estimate</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (priceBook.length === 0) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">New Estimate</h1>
        <p className="text-muted-foreground mb-4">
          Set up your Price Book first so you can add line items.
        </p>
        <Button onClick={() => router.push("/price-book")} size="lg">
          Go to Price Book
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-48">
      {/* ── Header with save status ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Estimate</h1>
        <div className="flex items-center gap-3">
          {/* Save status indicator */}
          {saveStatus === "saving" && (
            <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-green-500">Draft saved</span>
          )}
          {saveStatus === "offline" && (
            <span className="text-xs text-yellow-500">Offline — saved locally</span>
          )}
          {saveStatus === "restored" && (
            <span className="text-xs text-primary">Draft restored</span>
          )}
          {!isOnline && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              Offline
            </Badge>
          )}
          {hasMeaningfulContent(buildDraftState()) && (
            <Button variant="ghost" size="sm" onClick={startNew} className="text-xs text-muted-foreground">
              Clear
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* ── Header Fields ── */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input
                placeholder="e.g. Smith Kitchen Reno"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <Label>Customer</Label>
              <div className="flex gap-2">
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setShowNewCustomer(true)}>
                  + New
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Job Site Address</Label>
              <Input
                placeholder="123 Main St, Honolulu, HI"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <Label>Total Square Footage</Label>
              <Input
                type="number"
                placeholder="0"
                value={sqft || ""}
                onChange={(e) => setSqft(parseFloat(e.target.value) || 0)}
                className="text-lg font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Line Items ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Line Items</h2>
          <Button onClick={() => setPickerOpen(true)}>+ Add Item</Button>
        </div>

        {lineItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="mb-2">No items yet.</p>
              <p className="text-sm">Enter sqft above, then add items from your price book.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Item</th>
                    <th className="p-3 font-medium w-16">Type</th>
                    <th className="p-3 font-medium w-24">Qty</th>
                    <th className="p-3 font-medium w-16">Unit</th>
                    <th className="p-3 font-medium w-28">Rate</th>
                    <th className="p-3 font-medium w-20">Waste</th>
                    <th className="p-3 font-medium w-28 text-right">Total</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-t border-border/50">
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            item.itemType === "material"
                              ? "default"
                              : item.itemType === "labor"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {item.itemType}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {item.manualQty ? (
                          <Input
                            type="number"
                            value={item.rawQty}
                            onChange={(e) =>
                              updateLineQty(item.id, parseFloat(e.target.value) || 0)
                            }
                            className="h-8 w-20"
                          />
                        ) : (
                          <span className="font-mono">
                            {item.adjustedQty.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">{item.unit}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitCost}
                          onChange={(e) =>
                            updateLineRate(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="h-8 w-24 font-mono"
                        />
                      </td>
                      <td className="p-3">
                        {item.wasteFactor > 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            +{Math.round(item.wasteFactor * 100)}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCurrency(item.lineTotal)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="text-destructive hover:text-destructive/80 text-lg leading-none"
                          aria-label={`Remove ${item.name}`}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {lineItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex gap-2 items-center mt-1">
                          <Badge
                            variant={item.itemType === "material" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.itemType}
                          </Badge>
                          {item.wasteFactor > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{Math.round(item.wasteFactor * 100)}% waste
                            </Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-destructive text-lg"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2 items-center text-sm">
                        {item.manualQty ? (
                          <Input
                            type="number"
                            value={item.rawQty}
                            onChange={(e) =>
                              updateLineQty(item.id, parseFloat(e.target.value) || 0)
                            }
                            className="h-7 w-16"
                          />
                        ) : (
                          <span className="font-mono">{item.adjustedQty.toLocaleString()}</span>
                        )}
                        <span className="text-muted-foreground">{item.unit}</span>
                        <span className="text-muted-foreground">@</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitCost}
                          onChange={(e) =>
                            updateLineRate(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="h-7 w-20 font-mono"
                        />
                      </div>
                      <span className="font-mono font-semibold">
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Notes ── */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Scope of work, site conditions, special instructions, material specs..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* ── Tax Rate ── */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap">Tax Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={taxRate || ""}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Sticky Summary Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-background border-t shadow-lg z-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="grid grid-cols-2 md:flex md:gap-6 text-sm gap-y-1">
              <div>
                <span className="text-muted-foreground">Materials: </span>
                <span className="font-mono font-medium">{formatCurrency(materialTotal)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Labor: </span>
                <span className="font-mono font-medium">{formatCurrency(laborTotal)}</span>
              </div>
              {miscTotal > 0 && (
                <div>
                  <span className="text-muted-foreground">Misc: </span>
                  <span className="font-mono font-medium">{formatCurrency(miscTotal)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div>
                  <span className="text-muted-foreground">Tax: </span>
                  <span className="font-mono font-medium">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              <div className="col-span-2 md:col-span-1 text-lg">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-mono font-bold">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => submitEstimate(false)}
                disabled={submitting}
              >
                Save Draft
              </Button>
              <Button
                onClick={() => submitEstimate(true)}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save & Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Line Item Picker Dialog ── */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Line Item</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search price book..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            autoFocus
            className="mb-4"
          />
          {Object.entries(pickerGroups).map(([group, items]) => (
            <div key={group} className="mb-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {group}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const alreadyAdded = lineItems.some((l) => l.priceBookId === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => !alreadyAdded && addLineItem(item)}
                      disabled={alreadyAdded}
                      className={`w-full text-left p-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                        alreadyAdded
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-secondary cursor-pointer"
                      }`}
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.wasteFactor > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            +{Math.round(item.wasteFactor * 100)}% waste
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono text-muted-foreground">
                        {formatCurrency(item.costPerUnit)}/{item.unit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredPB.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No items match your search.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* ── New Customer Dialog ── */}
      <Dialog open={showNewCustomer} onOpenChange={setShowNewCustomer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newCustEmail}
                onChange={(e) => setNewCustEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="(808) 555-1234"
              />
            </div>
            <Button onClick={createCustomer} disabled={!newCustName.trim()} className="w-full">
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
