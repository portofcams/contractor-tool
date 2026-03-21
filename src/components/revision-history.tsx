"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Revision {
  id: string;
  version: number;
  total: number;
  subtotal: number;
  markupPercent: number;
  laborCost: number | null;
  taxRate: number;
  changeNote: string | null;
  createdAt: string;
}

export function RevisionHistory({
  quoteId,
  currentVersion,
}: {
  quoteId: string;
  currentVersion: number;
}) {
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function loadRevisions() {
    if (revisions) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/revisions`);
      if (res.ok) {
        const data = await res.json();
        setRevisions(data);
        setExpanded(true);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Version History</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            v{currentVersion}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={loadRevisions}
          disabled={loading}
          className="text-xs"
        >
          {loading ? "Loading..." : expanded ? "Hide" : "Show History"}
        </Button>
      </div>

      {expanded && revisions && (
        <div className="space-y-2">
          {revisions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              No previous versions. Revisions are saved automatically when changes are made.
            </p>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="border border-border rounded-lg p-3 text-sm space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Version {rev.version}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Total: ${rev.total.toLocaleString()}</span>
                  <span>Materials: ${rev.subtotal.toLocaleString()}</span>
                  <span>Markup: {rev.markupPercent}%</span>
                </div>
                {rev.changeNote && (
                  <p className="text-xs text-blue-400">{rev.changeNote}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
