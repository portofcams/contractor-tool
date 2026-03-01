"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface NotificationPrefsProps {
  notifyOnAccept: boolean;
  notifyOnDecline: boolean;
}

export function NotificationPrefs({ notifyOnAccept, notifyOnDecline }: NotificationPrefsProps) {
  const router = useRouter();
  const [accept, setAccept] = useState(notifyOnAccept);
  const [decline, setDecline] = useState(notifyOnDecline);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});

  async function handleToggle(field: "notifyOnAccept" | "notifyOnDecline", value: boolean) {
    if (field === "notifyOnAccept") setAccept(value);
    else setDecline(value);

    setSaving(true);
    setResult({});

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        setResult({ success: true, message: "Saved" });
        router.refresh();
      } else {
        setResult({ success: false, message: "Failed to save" });
        // Revert
        if (field === "notifyOnAccept") setAccept(!value);
        else setDecline(!value);
      }
    } catch {
      setResult({ success: false, message: "Network error" });
      if (field === "notifyOnAccept") setAccept(!value);
      else setDecline(!value);
    }
    setSaving(false);
    setTimeout(() => setResult({}), 2000);
  }

  return (
    <div className="space-y-4">
      {result.message && (
        <div
          className={`text-sm p-2 rounded-md ${
            result.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Quote Accepted</Label>
          <p className="text-xs text-muted-foreground">Email me when a customer accepts a quote</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={accept}
          disabled={saving}
          onClick={() => handleToggle("notifyOnAccept", !accept)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            accept ? "bg-blue-500" : "bg-secondary"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              accept ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Quote Declined</Label>
          <p className="text-xs text-muted-foreground">Email me when a customer declines a quote</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={decline}
          disabled={saving}
          onClick={() => handleToggle("notifyOnDecline", !decline)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            decline ? "bg-blue-500" : "bg-secondary"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              decline ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
