/**
 * Usage Indicator — shows quotes used this month vs plan limit.
 * Used on the dashboard and new quote page.
 */

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UsageIndicatorProps {
  quotesThisMonth: number;
  quotesLimit: number | null; // null = unlimited
  planName: string;
  compact?: boolean;
}

export function UsageIndicator({
  quotesThisMonth,
  quotesLimit,
  planName,
  compact = false,
}: UsageIndicatorProps) {
  if (quotesLimit === null) {
    if (compact) {
      return (
        <p className="text-xs text-muted-foreground">
          {planName} plan &middot; {quotesThisMonth} quotes this month
        </p>
      );
    }
    return null; // No indicator needed for unlimited plans
  }

  const remaining = Math.max(0, quotesLimit - quotesThisMonth);
  const percentage = Math.min(100, (quotesThisMonth / quotesLimit) * 100);
  const isWarning = remaining <= 2 && remaining > 0;
  const isBlocked = remaining === 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex-1 bg-[#334155] rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
              isBlocked
                ? "bg-red-500"
                : isWarning
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {quotesThisMonth}/{quotesLimit}
        </span>
      </div>
    );
  }

  return (
    <Card
      className={
        isBlocked
          ? "border-red-500/30 bg-red-500/10"
          : isWarning
          ? "border-yellow-500/30 bg-yellow-500/10"
          : ""
      }
    >
      <CardContent className="py-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className={isBlocked ? "text-red-400 font-medium" : "text-muted-foreground"}>
            {isBlocked
              ? "Monthly quote limit reached"
              : isWarning
              ? `Only ${remaining} quote${remaining !== 1 ? "s" : ""} remaining`
              : `${remaining} quotes remaining this month`}
          </span>
          <span className="font-medium">
            {quotesThisMonth}/{quotesLimit}
          </span>
        </div>
        <div className="w-full bg-[#334155] rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isBlocked
                ? "bg-red-500"
                : isWarning
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {(isBlocked || isWarning) && (
          <Link href="/settings/billing">
            <Button
              size="sm"
              variant={isBlocked ? "default" : "outline"}
              className="w-full mt-1"
            >
              {isBlocked ? "Upgrade to Continue" : "View Plans"}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
