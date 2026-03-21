"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SequenceStep {
  delayDays: number;
  message: string;
}

const DEFAULT_SEQUENCE: SequenceStep[] = [
  { delayDays: 3, message: "Just checking in — have you had a chance to review the quote?" },
  { delayDays: 7, message: "Following up on the quote I sent last week. Happy to answer any questions." },
  { delayDays: 14, message: "Wanted to touch base one last time about this quote. Let me know if you'd like to proceed or discuss any changes." },
];

export function FollowUpSequenceEditor({
  autoFollowUp,
  followUpSequence,
}: {
  autoFollowUp: boolean;
  followUpSequence: SequenceStep[] | null;
}) {
  const [enabled, setEnabled] = useState(autoFollowUp);
  const [steps, setSteps] = useState<SequenceStep[]>(followUpSequence || DEFAULT_SEQUENCE);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});

  function addStep() {
    const lastDelay = steps.length > 0 ? steps[steps.length - 1].delayDays : 0;
    setSteps([...steps, { delayDays: lastDelay + 7, message: "" }]);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: keyof SequenceStep, value: string | number) {
    setSteps(steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function save() {
    setSaving(true);
    setStatus({});

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoFollowUp: enabled,
          followUpSequence: steps.length > 0 ? steps : null,
        }),
      });

      if (res.ok) {
        setStatus({ success: true, message: "Saved" });
      } else {
        setStatus({ success: false, message: "Failed to save" });
      }
    } catch {
      setStatus({ success: false, message: "Network error" });
    }
    setSaving(false);
  }

  function resetToDefault() {
    setSteps(DEFAULT_SEQUENCE);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Auto Follow-Up</Label>
          <p className="text-xs text-muted-foreground">
            Automatically schedule follow-up reminders when you send a quote
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Sequence Steps</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetToDefault}
              className="text-xs text-muted-foreground"
            >
              Reset to Default
            </Button>
          </div>

          {steps.map((step, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-3 space-y-2 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </span>
                {steps.length > 1 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => removeStep(i)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs whitespace-nowrap">After</Label>
                <Input
                  type="number"
                  min={1}
                  max={90}
                  value={step.delayDays}
                  onChange={(e) => updateStep(i, "delayDays", parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
              <Input
                value={step.message}
                onChange={(e) => updateStep(i, "message", e.target.value)}
                placeholder="Follow-up message..."
                className="text-sm"
              />
            </div>
          ))}

          {steps.length < 5 && (
            <Button size="sm" variant="outline" onClick={addStep} className="w-full">
              Add Step
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save"}
        </Button>
        {status.message && (
          <span
            className={`text-sm ${
              status.success ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
