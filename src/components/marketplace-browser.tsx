"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SharedTemplate {
  id: string;
  authorName: string;
  name: string;
  trade: string;
  materials: { item: string; qty: number; unit: string; cost: number }[];
  markupPercent: number;
  description: string | null;
  downloads: number;
  createdAt: string;
}

export function MarketplaceBrowser() {
  const [templates, setTemplates] = useState<SharedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [trade, setTrade] = useState("all");
  const [sort, setSort] = useState("downloads");
  const [cloning, setCloning] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [trade, sort]);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (trade !== "all") params.set("trade", trade);
      const res = await fetch(`/api/templates/marketplace?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function cloneTemplate(id: string) {
    setCloning(id);
    try {
      const res = await fetch("/api/templates/marketplace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedTemplateId: id }),
      });
      if (res.ok) {
        await fetchTemplates();
      }
    } catch {
      // silently fail
    } finally {
      setCloning(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={trade} onValueChange={setTrade}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="flooring">Flooring</SelectItem>
            <SelectItem value="painting">Painting</SelectItem>
            <SelectItem value="drywall">Drywall</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No shared templates yet. Be the first to share one!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => {
            const subtotal = (t.materials as SharedTemplate["materials"]).reduce(
              (s, m) => s + m.cost,
              0
            );

            return (
              <Card key={t.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        by {t.authorName}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {t.trade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {t.description && (
                    <p className="text-sm text-muted-foreground">
                      {t.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {(t.materials as SharedTemplate["materials"]).length} items
                      &middot; ${subtotal.toFixed(0)} base
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.downloads} downloads
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cloneTemplate(t.id)}
                    disabled={cloning === t.id}
                    className="w-full"
                  >
                    {cloning === t.id ? "Adding..." : "Add to My Templates"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
