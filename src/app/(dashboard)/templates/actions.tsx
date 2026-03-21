"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareToMarketplace } from "@/components/share-to-marketplace";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface TemplateActionsProps {
  templateId: string;
  templateName: string;
  trade: string;
  materials: MaterialLine[];
  markupPercent: number;
  laborCost: number;
  taxRate: number;
}

export function TemplateActions({
  templateId,
  templateName,
  trade,
  materials: initialMaterials,
  markupPercent: initialMarkup,
  laborCost: initialLabor,
  taxRate: initialTax,
}: TemplateActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(templateName);
  const [materials, setMaterials] = useState(initialMaterials);
  const [markupPercent, setMarkupPercent] = useState(initialMarkup);
  const [laborCost, setLaborCost] = useState(initialLabor);
  const [taxRate, setTaxRate] = useState(initialTax);
  const [error, setError] = useState("");

  function updateMaterial(index: number, field: keyof MaterialLine, value: string | number) {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    // Recalculate cost if qty or unitCost changed
    if (field === "qty" || field === "unitCost") {
      updated[index].cost = Number(updated[index].qty) * Number(updated[index].unitCost);
    }
    setMaterials(updated);
  }

  async function saveTemplate() {
    setLoading("save");
    setError("");
    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, trade, materials, markupPercent, laborCost, taxRate }),
      });
      if (res.ok) {
        setEditOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    }
    setLoading("");
  }

  async function deleteTemplate() {
    if (!confirm("Delete this template?")) return;
    setLoading("delete");
    await fetch(`/api/templates/${templateId}`, { method: "DELETE" });
    router.refresh();
    setLoading("");
  }

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditOpen(true)}
          disabled={!!loading}
          className="text-muted-foreground hover:text-blue-400"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={deleteTemplate}
          disabled={!!loading}
          className="text-muted-foreground hover:text-red-400"
        >
          {loading === "delete" ? "..." : "Delete"}
        </Button>
        <ShareToMarketplace templateId={templateId} templateName={templateName} />
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="editName">Template Name</Label>
              <Input
                id="editName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Materials</Label>
              {materials.map((m, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    value={m.item}
                    onChange={(e) => updateMaterial(i, "item", e.target.value)}
                    className="col-span-5 text-sm"
                    placeholder="Item"
                  />
                  <Input
                    type="number"
                    value={m.qty || ""}
                    onChange={(e) => updateMaterial(i, "qty", Number(e.target.value))}
                    className="col-span-2 text-sm"
                    placeholder="Qty"
                  />
                  <Input
                    value={m.unit}
                    onChange={(e) => updateMaterial(i, "unit", e.target.value)}
                    className="col-span-2 text-sm"
                    placeholder="Unit"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={m.unitCost || ""}
                    onChange={(e) => updateMaterial(i, "unitCost", Number(e.target.value))}
                    className="col-span-2 text-sm"
                    placeholder="$/unit"
                  />
                  <button
                    type="button"
                    onClick={() => setMaterials(materials.filter((_, j) => j !== i))}
                    className="col-span-1 text-red-400 hover:text-red-300 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setMaterials([...materials, { item: "", qty: 0, unit: "sqft", unitCost: 0, cost: 0 }])
                }
              >
                + Add Material
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="editMarkup">Markup %</Label>
                <Input
                  id="editMarkup"
                  type="number"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editLabor">Labor $</Label>
                <Input
                  id="editLabor"
                  type="number"
                  value={laborCost || ""}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editTax">Tax %</Label>
                <Input
                  id="editTax"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTemplate} disabled={!name || loading === "save"}>
                {loading === "save" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
