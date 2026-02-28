"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  calculateFlooring,
  calculatePaint,
  calculateDrywall,
  defaultMaterialCosts,
  type FlooringMaterial,
  type InstallPattern,
  type PaintType,
  type SheetSize,
} from "@/lib/calculators";

interface UsageInfo {
  planName: string;
  quotesThisMonth: number;
  quotesLimit: number | null;
  quotesRemaining: number | null;
  isAtLimit: boolean;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
}

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface QuoteTemplate {
  id: string;
  name: string;
  trade: string;
  materials: MaterialLine[];
  markupPercent: number;
  laborCost: number | null;
  taxRate: number;
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function NewQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  // Step 1: Customer
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState(preselectedCustomerId || "");

  // Step 2: Dimensions
  const [rooms, setRooms] = useState([
    { name: "Room 1", length: 0, width: 0, height: 8 },
  ]);

  // Step 3: Trade & material
  const [trade, setTrade] = useState<"flooring" | "painting" | "drywall">("flooring");
  const [flooringMaterial, setFlooringMaterial] = useState<FlooringMaterial>("hardwood");
  const [installPattern, setInstallPattern] = useState<InstallPattern>("straight");
  const [paintType, setPaintType] = useState<PaintType>("interior");
  const [paintCoats, setPaintCoats] = useState(2);
  const [sheetSize, setSheetSize] = useState<SheetSize>("4x8");

  // Step 4: Materials calculated
  const [materials, setMaterials] = useState<MaterialLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [markupPercent, setMarkupPercent] = useState(50);
  const [taxRate, setTaxRate] = useState(0);

  // Templates
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers)
      .catch(() => {});
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: QuoteTemplate[]) => {
        if (Array.isArray(data)) setTemplates(data);
      })
      .catch(() => {});
  }, []);

  function applyTemplate(t: QuoteTemplate) {
    setTrade(t.trade as typeof trade);
    setMaterials(t.materials);
    const sub = t.materials.reduce((s, l) => s + l.cost, 0);
    setSubtotal(sub);
    setMarkupPercent(t.markupPercent);
    setLaborCost(t.laborCost || 0);
    setTaxRate(t.taxRate);
    setStep(4);
  }

  const totalSqft = rooms.reduce((sum, r) => sum + r.length * r.width, 0);
  const totalWallSqft = rooms.reduce(
    (sum, r) => sum + 2 * (r.length + r.width) * r.height,
    0
  );
  const totalCeilingSqft = totalSqft;

  function addRoom() {
    setRooms([
      ...rooms,
      { name: `Room ${rooms.length + 1}`, length: 0, width: 0, height: 8 },
    ]);
  }

  function removeRoom(index: number) {
    if (rooms.length > 1) setRooms(rooms.filter((_, i) => i !== index));
  }

  function updateRoom(index: number, field: string, value: string | number) {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: value };
    setRooms(updated);
  }

  function calculateMaterials() {
    const lines: MaterialLine[] = [];

    if (trade === "flooring") {
      const result = calculateFlooring({
        squareFootage: totalSqft,
        materialType: flooringMaterial,
        installPattern,
      });
      const cost =
        defaultMaterialCosts.flooring[flooringMaterial].costPerUnit;
      lines.push({
        item: `${flooringMaterial.charAt(0).toUpperCase() + flooringMaterial.slice(1)} Flooring`,
        qty: result.totalSqft,
        unit: "sqft",
        unitCost: cost,
        cost: result.totalSqft * cost,
      });
      lines.push({
        item: `${flooringMaterial.charAt(0).toUpperCase() + flooringMaterial.slice(1)} (${result.boxesNeeded} boxes)`,
        qty: result.boxesNeeded,
        unit: "boxes",
        unitCost: 0,
        cost: 0,
      });
    } else if (trade === "painting") {
      const result = calculatePaint({
        wallSqft: totalWallSqft,
        ceilingSqft: paintType === "ceiling" ? totalCeilingSqft : 0,
        coats: paintCoats,
        paintType,
      });
      const cost = defaultMaterialCosts.paint[paintType].costPerUnit;
      lines.push({
        item: `${paintType.charAt(0).toUpperCase() + paintType.slice(1)} Paint`,
        qty: result.gallons,
        unit: "gallons",
        unitCost: cost,
        cost: result.gallons * cost,
      });
    } else if (trade === "drywall") {
      const result = calculateDrywall({
        wallSqft: totalWallSqft,
        ceilingSqft: totalCeilingSqft,
        sheetSize,
      });
      const sheetKey = `sheet_${sheetSize.replace("x", "x")}` as keyof typeof defaultMaterialCosts.drywall;
      const sheetCost = defaultMaterialCosts.drywall[sheetKey]?.costPerUnit ?? 12;
      lines.push({
        item: `Drywall Sheets (${sheetSize})`,
        qty: result.sheets,
        unit: "sheets",
        unitCost: sheetCost,
        cost: result.sheets * sheetCost,
      });
      lines.push({
        item: "Joint Compound",
        qty: result.mudBuckets,
        unit: "buckets",
        unitCost: defaultMaterialCosts.drywall.mud.costPerUnit,
        cost: result.mudBuckets * defaultMaterialCosts.drywall.mud.costPerUnit,
      });
      lines.push({
        item: "Drywall Tape",
        qty: result.tapeFeet,
        unit: "feet",
        unitCost: defaultMaterialCosts.drywall.tape.costPerUnit,
        cost: result.tapeFeet * defaultMaterialCosts.drywall.tape.costPerUnit,
      });
    }

    setMaterials(lines);
    const sub = lines.reduce((s, l) => s + l.cost, 0);
    setSubtotal(sub);
    setStep(4);
  }

  function getTotal() {
    const materialWithMarkup = subtotal * (1 + markupPercent / 100);
    const withLabor = materialWithMarkup + laborCost;
    const withTax = withLabor * (1 + taxRate / 100);
    return Math.round(withTax * 100) / 100;
  }

  async function submitQuote() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        trade,
        materials,
        subtotal,
        laborCost: laborCost || undefined,
        markupPercent,
        taxRate,
        total: getTotal(),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create quote");
      setLoading(false);
      return;
    }

    const quote = await res.json();
    router.push(`/quotes/${quote.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? "bg-amber-500" : "bg-[#333842]"
            }`}
          />
        ))}
      </div>
      {usage && usage.quotesRemaining !== null && !usage.isAtLimit && (
        <p className="text-xs text-muted-foreground text-center">
          {usage.quotesRemaining} quote{usage.quotesRemaining !== 1 ? "s" : ""}{" "}
          remaining on {usage.planName} plan &middot;{" "}
          <Link href="/settings/billing" className="text-amber-500 hover:underline">
            Upgrade
          </Link>
        </p>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Quote limit blocker */}
      {usage?.isAtLimit && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-red-400 font-medium text-lg">
              Monthly quote limit reached
            </p>
            <p className="text-red-400 text-sm">
              You&apos;ve used all {usage.quotesLimit} quotes on the{" "}
              {usage.planName} plan this month. Upgrade to create unlimited
              quotes.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/settings/billing">
                <Button>Upgrade Plan</Button>
              </Link>
              <Link href="/quotes">
                <Button variant="outline">View Existing Quotes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Select Customer */}
      {step === 1 && !usage?.isAtLimit && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Or{" "}
              <a href="/customers/new" className="text-amber-500 hover:underline">
                add a new customer
              </a>
            </p>
            <Button
              onClick={() => setStep(2)}
              disabled={!customerId}
              className="w-full"
            >
              Next — Enter Dimensions
            </Button>

            {/* Templates */}
            {templates.length > 0 && customerId && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Or start from a template:</p>
                <div className="space-y-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => applyTemplate(t)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-amber-500/50 hover:bg-secondary transition-colors"
                    >
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {t.trade} &middot; {t.materials.length} items &middot; {t.markupPercent}% markup
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Room Dimensions */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Room Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={room.name}
                    onChange={(e) => updateRoom(i, "name", e.target.value)}
                    className="font-medium max-w-48"
                  />
                  {rooms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoom(i)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Length (ft)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={room.length || ""}
                      onChange={(e) =>
                        updateRoom(i, "length", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Width (ft)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={room.width || ""}
                      onChange={(e) =>
                        updateRoom(i, "width", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height (ft)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={room.height || ""}
                      onChange={(e) =>
                        updateRoom(i, "height", parseFloat(e.target.value) || 0)
                      }
                      placeholder="8"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {room.length * room.width} sqft floor &middot;{" "}
                  {2 * (room.length + room.width) * room.height} sqft walls
                </p>
              </div>
            ))}
            <Button variant="outline" onClick={addRoom} className="w-full">
              + Add Room
            </Button>
            <div className="bg-amber-500/10 p-3 rounded-md text-sm">
              <strong>Total:</strong> {totalSqft} sqft floor &middot;{" "}
              {totalWallSqft} sqft walls
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={totalSqft === 0}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Trade & Material Selection */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Trade & Material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trade Type</Label>
              <Select
                value={trade}
                onValueChange={(v) => setTrade(v as typeof trade)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="drywall">Drywall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {trade === "flooring" && (
              <>
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select
                    value={flooringMaterial}
                    onValueChange={(v) =>
                      setFlooringMaterial(v as FlooringMaterial)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardwood">Hardwood ($5/sqft)</SelectItem>
                      <SelectItem value="laminate">Laminate ($2.50/sqft)</SelectItem>
                      <SelectItem value="tile">Tile ($4/sqft)</SelectItem>
                      <SelectItem value="carpet">Carpet ($3/sqft)</SelectItem>
                      <SelectItem value="vinyl">Vinyl ($2/sqft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Install Pattern</Label>
                  <Select
                    value={installPattern}
                    onValueChange={(v) =>
                      setInstallPattern(v as InstallPattern)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight (10% waste)</SelectItem>
                      <SelectItem value="diagonal">Diagonal (15% waste)</SelectItem>
                      <SelectItem value="herringbone">Herringbone (20% waste)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {trade === "painting" && (
              <>
                <div className="space-y-2">
                  <Label>Paint Type</Label>
                  <Select
                    value={paintType}
                    onValueChange={(v) => setPaintType(v as PaintType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior ($35/gal)</SelectItem>
                      <SelectItem value="exterior">Exterior ($45/gal)</SelectItem>
                      <SelectItem value="ceiling">Ceiling ($30/gal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Coats</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={paintCoats}
                    onChange={(e) => setPaintCoats(parseInt(e.target.value) || 2)}
                  />
                </div>
              </>
            )}

            {trade === "drywall" && (
              <div className="space-y-2">
                <Label>Sheet Size</Label>
                <Select
                  value={sheetSize}
                  onValueChange={(v) => setSheetSize(v as SheetSize)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4x8">4x8 ($12/sheet)</SelectItem>
                    <SelectItem value="4x10">4x10 ($15/sheet)</SelectItem>
                    <SelectItem value="4x12">4x12 ($18/sheet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={calculateMaterials} className="flex-1">
                Calculate Materials
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review Materials & Pricing */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Review & Adjust Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-3">Item</th>
                    <th className="text-right p-3">Qty</th>
                    <th className="text-right p-3">Unit Cost</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{m.item}</td>
                      <td className="text-right p-3">
                        {m.qty} {m.unit}
                      </td>
                      <td className="text-right p-3">
                        {m.unitCost > 0 ? `$${m.unitCost.toFixed(2)}` : "—"}
                      </td>
                      <td className="text-right p-3">
                        {m.cost > 0 ? `$${m.cost.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Markup %</Label>
                <Input
                  type="number"
                  min={0}
                  value={markupPercent}
                  onChange={(e) =>
                    setMarkupPercent(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Labor Cost ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={laborCost || ""}
                  onChange={(e) =>
                    setLaborCost(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate %</Label>
                <Input
                  type="number"
                  min={0}
                  value={taxRate || ""}
                  onChange={(e) =>
                    setTaxRate(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-secondary p-4 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Materials Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Markup ({markupPercent}%)</span>
                <span>${(subtotal * (markupPercent / 100)).toFixed(2)}</span>
              </div>
              {laborCost > 0 && (
                <div className="flex justify-between">
                  <span>Labor</span>
                  <span>${laborCost.toFixed(2)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%)</span>
                  <span>
                    $
                    {(
                      (subtotal * (1 + markupPercent / 100) + laborCost) *
                      (taxRate / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1">
                Review Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Confirm & Submit */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 5: Confirm Quote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">
                  {customers.find((c) => c.id === customerId)?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Trade</span>
                <span className="font-medium capitalize">{trade}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Area</span>
                <span className="font-medium">{totalSqft} sqft</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Materials</span>
                <span className="font-medium">
                  {materials.filter((m) => m.cost > 0).length} items
                </span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(4)}>
                Back
              </Button>
              <Button
                onClick={submitQuote}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Quote"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
