"use client";

import { useState, useRef } from "react";
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
  defaultTaxRate: number;
  defaultLaborCost: number;
  logoUrl: string;
}

export function SettingsForm({ contractor }: { contractor: ContractorSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState(contractor.trade);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});
  const [logoUrl, setLogoUrl] = useState(contractor.logoUrl);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    setResult({});
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/settings/logo", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.logoUrl);
        setResult({ success: true, message: "Logo uploaded" });
        router.refresh();
      } else {
        const data = await res.json();
        setResult({ success: false, message: data.error || "Upload failed" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    }
    setUploadingLogo(false);
  }

  async function handleLogoRemove() {
    setUploadingLogo(true);
    try {
      const res = await fetch("/api/settings/logo", { method: "DELETE" });
      if (res.ok) {
        setLogoUrl("");
        setResult({ success: true, message: "Logo removed" });
        router.refresh();
      }
    } catch {
      setResult({ success: false, message: "Failed to remove logo" });
    }
    setUploadingLogo(false);
  }

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
          defaultTaxRate: parseFloat(formData.get("defaultTaxRate") as string) || 0,
          defaultLaborCost: parseFloat(formData.get("defaultLaborCost") as string) || 0,
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
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Company Logo</Label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative w-20 h-20 rounded-lg border border-border overflow-hidden bg-secondary">
              <img
                src={logoUrl}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
          <div className="space-y-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogoUpload(f);
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingLogo}
              onClick={() => logoInputRef.current?.click()}
            >
              {uploadingLogo ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
            </Button>
            {logoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploadingLogo}
                onClick={handleLogoRemove}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP, or SVG up to 2MB. Shown on PDF quotes.
            </p>
          </div>
        </div>
      </div>

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
          className="bg-secondary"
        />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
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

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="defaultMarkup">Markup (%)</Label>
          <Input
            id="defaultMarkup"
            name="defaultMarkup"
            type="number"
            min={0}
            max={500}
            step={1}
            defaultValue={contractor.defaultMarkup}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultTaxRate">Tax Rate (%)</Label>
          <Input
            id="defaultTaxRate"
            name="defaultTaxRate"
            type="number"
            min={0}
            max={100}
            step={0.1}
            defaultValue={contractor.defaultTaxRate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultLaborCost">Labor ($)</Label>
          <Input
            id="defaultLaborCost"
            name="defaultLaborCost"
            type="number"
            min={0}
            step={1}
            defaultValue={contractor.defaultLaborCost}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        These defaults are applied automatically to new quotes
      </p>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
