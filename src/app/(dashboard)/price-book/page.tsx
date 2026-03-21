"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  active: boolean;
}

type GroupedItems = Record<string, Record<string, PriceBookItem[]>>;

function groupItems(items: PriceBookItem[]): GroupedItems {
  const grouped: GroupedItems = {};
  for (const item of items) {
    const cat = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const type = item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1);
    if (!grouped[cat]) grouped[cat] = {};
    if (!grouped[cat][type]) grouped[cat][type] = [];
    grouped[cat][type].push(item);
  }
  return grouped;
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function PriceBookPage() {
  const [items, setItems] = useState<PriceBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<PriceBookItem>>({});
  const [search, setSearch] = useState("");

  // Add form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "flooring",
    materialType: "",
    itemType: "material" as "material" | "labor" | "misc",
    unit: "sqft",
    costPerUnit: 0,
    wasteFactor: 0,
    defaultQty: undefined as number | undefined,
  });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/price-book");
    if (res.ok) {
      setItems(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function seedDefaults() {
    setLoading(true);
    const res = await fetch("/api/price-book/seed", { method: "POST" });
    if (res.ok) {
      await fetchItems();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to seed defaults");
      setLoading(false);
    }
  }

  async function addItem() {
    const slug = newItem.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 50);
    const res = await fetch("/api/price-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        materialType: slug,
        wasteFactor: newItem.itemType === "material" && newItem.unit === "sqft" ? 0.08 : 0,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setNewItem({ name: "", category: "flooring", materialType: "", itemType: "material", unit: "sqft", costPerUnit: 0, wasteFactor: 0, defaultQty: undefined });
      await fetchItems();
    }
  }

  function startEdit(item: PriceBookItem) {
    setEditingId(item.id);
    setEditValues({ name: item.name, costPerUnit: item.costPerUnit, wasteFactor: item.wasteFactor });
  }

  async function saveEdit(id: string) {
    await fetch(`/api/price-book/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setEditingId(null);
    await fetchItems();
  }

  async function deleteItem(id: string) {
    if (!confirm("Remove this item from your price book?")) return;
    await fetch(`/api/price-book/${id}`, { method: "DELETE" });
    await fetchItems();
  }

  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;
  const grouped = groupItems(filtered);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Price Book</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Price Book</h1>
        <p className="text-muted-foreground mb-6">
          No items yet. Load default flooring line items to get started.
        </p>
        <Button onClick={seedDefaults} size="lg">
          Load Default Flooring Items
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Price Book</h1>
        <Button onClick={() => setShowAdd(true)}>+ Add Item</Button>
      </div>

      <Input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {Object.entries(grouped).map(([category, types]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">{category}</h2>
          {Object.entries(types).map(([type, typeItems]) => (
            <div key={type} className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {type}
              </h3>

              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium w-28">Rate</th>
                      <th className="pb-2 font-medium w-20">Unit</th>
                      <th className="pb-2 font-medium w-20">Waste</th>
                      <th className="pb-2 font-medium w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeItems.map((item) => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-2">
                          {editingId === item.id ? (
                            <Input
                              value={editValues.name || ""}
                              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            <span
                              className="cursor-pointer hover:text-primary"
                              onClick={() => startEdit(item)}
                            >
                              {item.name}
                            </span>
                          )}
                        </td>
                        <td className="py-2">
                          {editingId === item.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues.costPerUnit || 0}
                              onChange={(e) => setEditValues({ ...editValues, costPerUnit: parseFloat(e.target.value) || 0 })}
                              className="h-8 w-24"
                            />
                          ) : (
                            <span
                              className="cursor-pointer hover:text-primary font-mono"
                              onClick={() => startEdit(item)}
                            >
                              {formatCurrency(item.costPerUnit)}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-muted-foreground">/{item.unit}</td>
                        <td className="py-2">
                          {item.wasteFactor > 0 && (
                            <Badge variant="secondary">+{Math.round(item.wasteFactor * 100)}%</Badge>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          {editingId === item.id ? (
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="default" onClick={() => saveEdit(item.id)}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {typeItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer" onClick={() => startEdit(item)}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.costPerUnit)}/{item.unit}
                          {item.wasteFactor > 0 && ` (+${Math.round(item.wasteFactor * 100)}% waste)`}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Add Item Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Price Book Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item Name</Label>
              <Input
                placeholder="e.g. Evolv LVP - Driftwood"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flooring">Flooring</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="drywall">Drywall</SelectItem>
                    <SelectItem value="tile">Tile</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="misc">Misc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newItem.itemType}
                  onValueChange={(v) => setNewItem({ ...newItem, itemType: v as "material" | "labor" | "misc" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="misc">Misc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cost Per Unit</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.costPerUnit || ""}
                  onChange={(e) => setNewItem({ ...newItem, costPerUnit: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={newItem.unit}
                  onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">sqft</SelectItem>
                    <SelectItem value="lf">lf</SelectItem>
                    <SelectItem value="ea">ea</SelectItem>
                    <SelectItem value="gallon">gallon</SelectItem>
                    <SelectItem value="sheet">sheet</SelectItem>
                    <SelectItem value="hr">hr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {newItem.itemType === "material" && newItem.unit === "sqft" && (
              <p className="text-sm text-muted-foreground">
                8% waste factor will be applied automatically for flooring materials.
              </p>
            )}
            <Button onClick={addItem} disabled={!newItem.name || !newItem.costPerUnit} className="w-full">
              Add to Price Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
