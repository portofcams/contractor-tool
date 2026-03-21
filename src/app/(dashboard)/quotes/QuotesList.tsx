"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuoteItem {
  id: string;
  quoteNumber: string;
  trade: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string | null };
}

export function QuotesList({ quotes }: { quotes: QuoteItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; errors: string[] } | null>(null);

  const draftQuotes = quotes.filter((q) => q.status === "draft");
  const allDraftsSelected = draftQuotes.length > 0 && draftQuotes.every((q) => selected.has(q.id));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allDraftsSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(draftQuotes.map((q) => q.id)));
    }
  }

  async function sendAll() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/quotes/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteIds: Array.from(selected) }),
      });
      const data = await res.json();
      setResult(data);
      setSelected(new Set());
      if (data.sent > 0) {
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch {
      setResult({ sent: 0, failed: selected.size, errors: ["Network error"] });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {draftQuotes.length > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={allDraftsSelected}
              onChange={toggleAll}
              className="rounded border-border"
            />
            Select all drafts ({draftQuotes.length})
          </label>
        </div>
      )}

      <div className="space-y-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-center gap-2">
            {quote.status === "draft" && (
              <input
                type="checkbox"
                checked={selected.has(quote.id)}
                onChange={() => toggleSelect(quote.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-border shrink-0"
              />
            )}
            <Link href={`/quotes/${quote.id}`} className="flex-1">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{quote.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.quoteNumber} &middot;{" "}
                      <span className="capitalize">{quote.trade}</span> &middot;{" "}
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      ${quote.total.toLocaleString()}
                    </span>
                    <Badge
                      variant={
                        quote.status === "accepted"
                          ? "default"
                          : quote.status === "sent"
                          ? "secondary"
                          : quote.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {quote.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`p-3 rounded-lg text-sm ${result.sent > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {result.sent > 0 && <p>{result.sent} quote{result.sent !== 1 ? "s" : ""} sent successfully!</p>}
          {result.failed > 0 && <p>{result.failed} failed: {result.errors.join(", ")}</p>}
        </div>
      )}

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-lg shadow-lg px-6 py-3 flex items-center gap-4">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={sendAll}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send All"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelected(new Set())}
            className="text-primary-foreground/70 hover:text-primary-foreground"
          >
            Cancel
          </Button>
        </div>
      )}
    </>
  );
}
