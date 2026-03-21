"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SMSButtonProps {
  type: "quote_sent" | "job_reminder" | "custom";
  customerId: string;
  quoteId?: string;
  jobId?: string;
  customerPhone?: string;
  label?: string;
}

export function SMSButton({
  type,
  customerId,
  quoteId,
  jobId,
  customerPhone,
  label,
}: SMSButtonProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!customerPhone) return null;

  async function send() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, customerId, quoteId, jobId }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send SMS");
      }
    } catch {
      setError("Failed to send SMS");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Button variant="outline" size="sm" disabled>
        SMS Sent
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={send}
        disabled={sending}
      >
        {sending ? "Sending..." : label || "Send SMS"}
      </Button>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
