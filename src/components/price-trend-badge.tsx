"use client";

import { useState, useEffect } from "react";

interface PriceTrend {
  date: string;
  price: number;
}

export function PriceTrendBadge({ materialType }: { materialType: string }) {
  const [trend, setTrend] = useState<"up" | "down" | "stable" | null>(null);
  const [pctChange, setPctChange] = useState(0);

  useEffect(() => {
    fetch(`/api/materials/prices?category=all`)
      .then((r) => r.json())
      .then((data) => {
        const history: PriceTrend[] = data.trends?.[materialType] || [];
        if (history.length < 2) {
          setTrend("stable");
          return;
        }
        const oldest = history[0].price;
        const newest = history[history.length - 1].price;
        const change = ((newest - oldest) / oldest) * 100;
        setPctChange(Math.abs(change));
        if (change > 2) setTrend("up");
        else if (change < -2) setTrend("down");
        else setTrend("stable");
      })
      .catch(() => setTrend(null));
  }, [materialType]);

  if (!trend) return null;

  const color =
    trend === "up"
      ? "text-red-500"
      : trend === "down"
        ? "text-green-500"
        : "text-muted-foreground";

  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <span className={`text-xs ${color} ml-1`} title={`${pctChange.toFixed(1)}% ${trend} (90 days)`}>
      {arrow} {pctChange > 0.5 ? `${pctChange.toFixed(1)}%` : "stable"}
    </span>
  );
}
