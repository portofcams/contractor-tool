"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfitData {
  jobNumber: string;
  customerName: string;
  trade: string;
  estimatedRevenue: number;
  estimatedMaterials: number;
  estimatedLabor: number;
  actualMaterials: number;
  actualLabor: number;
  actualOther: number;
  totalActualCost: number;
  grossProfit: number;
  profitMargin: number;
  costBreakdown: Array<{
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

export function ProfitCalculator({ jobId }: { jobId: string }) {
  const [data, setData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}/profit`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <p className="text-xs text-muted-foreground">Loading profit data...</p>;
  if (!data) return null;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
  const isProfit = data.grossProfit >= 0;
  const maxBar = Math.max(data.estimatedRevenue, data.totalActualCost, 1);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
      >
        <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Profit Analysis
      </button>

      {expanded && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Profit / Loss</span>
              <span className={`text-lg font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                {isProfit ? "+" : ""}{fmt(data.grossProfit)} ({data.profitMargin}%)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Revenue vs Cost bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">{fmt(data.estimatedRevenue)}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(data.estimatedRevenue / maxBar) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Total Costs</span>
                  <span className="font-medium">{fmt(data.totalActualCost)}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(data.totalActualCost / maxBar) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Estimated vs Actual table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-2 font-medium text-muted-foreground">Category</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Estimated</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Actual</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Materials", est: data.estimatedMaterials, act: data.actualMaterials },
                    { label: "Labor", est: data.estimatedLabor, act: data.actualLabor },
                    { label: "Other", est: 0, act: data.actualOther },
                  ].map((row) => {
                    const diff = row.est - row.act;
                    return (
                      <tr key={row.label} className="border-t border-border">
                        <td className="p-2">{row.label}</td>
                        <td className="p-2 text-right">{fmt(row.est)}</td>
                        <td className="p-2 text-right">{fmt(row.act)}</td>
                        <td className={`p-2 text-right font-medium ${diff >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {diff >= 0 ? "+" : ""}{fmt(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cost line items */}
            {data.costBreakdown.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Recorded Expenses</p>
                <div className="space-y-1">
                  {data.costBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded hover:bg-secondary">
                      <div>
                        <span>{item.description}</span>
                        <span className="text-xs text-muted-foreground ml-2">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <span className="font-medium">{fmt(item.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
