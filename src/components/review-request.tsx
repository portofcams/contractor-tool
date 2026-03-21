"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewRequestProps {
  customerId: string;
  quoteId: string;
  customerEmail?: string;
}

export function ReviewRequest({ customerId, quoteId, customerEmail }: ReviewRequestProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!customerEmail) return null;

  async function requestReview() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, quoteId }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send");
      }
    } catch {
      setError("Failed to send review request");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Button variant="outline" size="sm" disabled>
        Review Requested
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={requestReview}
        disabled={sending}
      >
        {sending ? "Sending..." : "Request Review"}
      </Button>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
