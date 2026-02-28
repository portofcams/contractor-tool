"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContractorSettings {
  companyName: string;
  email: string;
  phone: string;
  trade: string;
  defaultMarkup: number;
}

export function SettingsForm({ contractor }: { contractor: ContractorSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState(contractor.trade);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.get("companyName"),
          phone: formData.get("phone") || null,
          trade,
          defaultMarkup: parseFloat(formData.get("defaultMarkup") as string) || 50,
        }),
      });

      if (res.ok) {
        setResult({ success: true, message: "Settings saved" });
        router.refresh();
      } else {
        const data = await res.json();
        setResult({ success: false, message: data.error || "Failed to save" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {result.message && (
        <div
          className={`text-sm p-3 rounded-md ${
            result.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          defaultValue={contractor.companyName}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={contractor.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-400">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={contractor.phone}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trade">Primary Trade</Label>
        <Select value={trade} onValueChange={setTrade}>
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

      <div className="space-y-2">
        <Label htmlFor="defaultMarkup">Default Markup (%)</Label>
        <Input
          id="defaultMarkup"
          name="defaultMarkup"
          type="number"
          min={0}
          max={500}
          step={1}
          defaultValue={contractor.defaultMarkup}
        />
        <p className="text-xs text-gray-400">
          Applied automatically to new quotes
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
