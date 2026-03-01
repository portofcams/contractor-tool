"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FollowUp {
  id: string;
  reminderDate: string;
  message: string | null;
  status: string;
}

function statusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    case "sent":
      return "text-green-400 bg-green-400/10 border-green-400/30";
    case "dismissed":
      return "text-muted-foreground bg-secondary border-border";
    default:
      return "text-muted-foreground bg-secondary border-border";
  }
}

export function FollowUpManager({
  quoteId,
  followUps: initialFollowUps,
}: {
  quoteId: string;
  followUps: FollowUp[];
}) {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [reminderDate, setReminderDate] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function addReminder() {
    if (!reminderDate) return;
    setSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          reminderDate,
          message: message || null,
        }),
      });

      if (res.ok) {
        const followUp = await res.json();
        setFollowUps((prev) => [...prev, followUp]);
        setReminderDate("");
        setMessage("");
        setShowForm(false);
        setStatusMessage("Reminder added.");
      } else {
        setStatusMessage("Failed to add reminder.");
      }
    } catch {
      setStatusMessage("Failed to add reminder.");
    }
    setSaving(false);
  }

  async function dismissReminder(id: string) {
    setDismissingId(id);
    setStatusMessage("");

    try {
      const res = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "dismissed" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
        setStatusMessage("Reminder dismissed.");
      } else {
        setStatusMessage("Failed to dismiss reminder.");
      }
    } catch {
      setStatusMessage("Failed to dismiss reminder.");
    }
    setDismissingId(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Follow-up Reminders</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Reminder"}
        </Button>
      </div>

      {/* Add reminder form */}
      {showForm && (
        <div className="border border-border rounded-lg p-3 space-y-3 bg-secondary/50">
          <div className="space-y-1.5">
            <Label htmlFor="reminder-date">Reminder Date</Label>
            <Input
              id="reminder-date"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reminder-message">Message (optional)</Label>
            <Input
              id="reminder-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Call to confirm start date"
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={addReminder}
              disabled={!reminderDate || saving}
            >
              {saving ? "Saving..." : "Save Reminder"}
            </Button>
          </div>
        </div>
      )}

      {/* Follow-ups list */}
      {followUps.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2 text-center">
          No reminders set. Add one to stay on top of follow-ups.
        </p>
      ) : (
        <ul className="space-y-2 list-none p-0" aria-label="Follow-up reminders">
          {followUps.map((followUp) => (
            <li
              key={followUp.id}
              className="border border-border rounded-lg p-3 flex items-start justify-between gap-3"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {new Date(followUp.reminderDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${statusColor(followUp.status)}`}
                  >
                    {followUp.status}
                  </span>
                </div>
                {followUp.message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {followUp.message}
                  </p>
                )}
              </div>
              {followUp.status === "pending" && (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => dismissReminder(followUp.id)}
                  disabled={dismissingId === followUp.id}
                  aria-label={`Dismiss reminder for ${new Date(followUp.reminderDate).toLocaleDateString()}`}
                >
                  {dismissingId === followUp.id ? "..." : "Dismiss"}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Live region for status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
    </div>
  );
}
