"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CalendarSync({ jobId }: { jobId: string }) {
  const [syncing, setSyncing] = useState(false);

  async function syncToCalendar() {
    setSyncing(true);
    try {
      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        const data = await res.json();
        window.open(data.calendarUrl, "_blank");
      }
    } catch {
      // silently fail
    } finally {
      setSyncing(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={syncToCalendar} disabled={syncing}>
      {syncing ? "Opening..." : "Add to Google Calendar"}
    </Button>
  );
}
