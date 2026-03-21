"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingStep {
  label: string;
  done: boolean;
  href: string;
  cta: string;
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const allDone = completed === total;

  if (dismissed) return null;

  return (
    <Card className={allDone ? "border-green-500/30" : "border-primary/30"}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          {allDone ? "Setup Complete!" : "Get Started"}
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {completed}/{total}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground text-sm"
            aria-label="Dismiss checklist"
          >
            &times;
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-4">
          <div
            className={`h-2 rounded-full transition-all ${allDone ? "bg-green-500" : "bg-primary"}`}
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.done
                      ? "bg-green-500/20 text-green-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step.done ? "\u2713" : i + 1}
                </span>
                <span className={`text-sm ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {!step.done && (
                <Link href={step.href}>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    {step.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
