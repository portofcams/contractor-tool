"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RecurrenceSelectorProps {
  quoteId: string;
  currentRecurrence: string | null;
  nextRecurrenceAt: string | null;
}

const options = [
  { value: "", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

export function RecurrenceSelector({
  quoteId,
  currentRecurrence,
  nextRecurrenceAt,
}: RecurrenceSelectorProps) {
  const router = useRouter();
  const [recurrence, setRecurrence] = useState(currentRecurrence || "");
  const [saving, setSaving] = useState(false);

  async function save(value: string) {
    setRecurrence(value);
    setSaving(true);

    await fetch(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recurrence: value || null,
      }),
    });

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Repeat:</span>
      {options.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={recurrence === opt.value ? "default" : "outline"}
          onClick={() => save(opt.value)}
          disabled={saving}
          className="text-xs h-7"
        >
          {opt.label}
        </Button>
      ))}
      {nextRecurrenceAt && recurrence && (
        <span className="text-xs text-muted-foreground ml-2">
          Next: {new Date(nextRecurrenceAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
