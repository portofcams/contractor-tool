"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Welcome to ProBuildCalc",
    content:
      "Your company is set up and ready to go. Let's walk through the key features so you can start quoting faster.",
    highlight: null,
    action: null,
  },
  {
    title: "Dashboard",
    content:
      "This is your home base. See your monthly quotes, revenue, and recent activity at a glance. The chart tracks your quote volume over time.",
    highlight: "/dashboard",
    action: "Check out your dashboard stats",
  },
  {
    title: "Quotes",
    content:
      "Your bread and butter. We've pre-loaded a few sample quotes so you can see how they look. Click any quote to view details, generate a PDF, or email it to the customer.",
    highlight: "/quotes",
    action: "View your quotes",
  },
  {
    title: "Create a New Quote",
    content:
      'Click "New Quote" to build one from scratch. Pick a customer, add materials from your price book, set markup and tax. The total calculates automatically. You can also use AI Photo Estimates — snap a photo and let AI do the math.',
    highlight: "/quotes/new",
    action: "Try creating a quote",
  },
  {
    title: "AI Photo Estimates",
    content:
      "Take a photo of any room. AI analyzes the space and generates a material list with quantities and costs. Works for hardwood, tile, stone — even refinishing jobs. Great for quick on-site estimates.",
    highlight: "/estimates/new",
    action: "Try an AI estimate",
  },
  {
    title: "Customers",
    content:
      "All your clients in one place. We've added a few sample customers. Each one gets a portal link where they can view quotes, accept, and e-sign — no account needed.",
    highlight: "/customers",
    action: "View your customers",
  },
  {
    title: "Jobs",
    content:
      "When a customer accepts a quote, it becomes a job. Track status, schedule dates, assign crew members, and log actual costs to see your real profit margin.",
    highlight: "/jobs",
    action: "Check your jobs",
  },
  {
    title: "Time Tracking",
    content:
      "Clock in and out per job. Assign hours to crew members. See daily and weekly totals. Great for tracking labor costs and billing accurately.",
    highlight: "/time-tracking",
    action: "Try clocking in",
  },
  {
    title: "Receipts",
    content:
      'Snap a photo of any receipt — Home Depot, lumber yard, whatever. AI reads it and extracts the store, items, and total. Link it to a job and it automatically tracks as an actual cost.',
    highlight: "/receipts",
    action: "Scan a receipt",
  },
  {
    title: "Team",
    content:
      "Your crew is already loaded — Alex, Pierre, Pat Von, Pat Tile, and John. Set hourly rates, assign to jobs, and track everyone's hours.",
    highlight: "/team",
    action: "View your team",
  },
  {
    title: "Price Book",
    content:
      "Your material catalog with standard pricing. Add your go-to materials and costs so every quote starts with accurate numbers. Seed it with defaults or build your own.",
    highlight: "/price-book",
    action: "Set up your price book",
  },
  {
    title: "Settings",
    content:
      "Default markup (45%), tax rate (4.712% GET), and labor cost are already set for Hawaii. Upload your logo, configure email notifications, and manage your subscription here.",
    highlight: "/settings",
    action: "Review your settings",
  },
  {
    title: "You're All Set!",
    content:
      "That's the tour. You've got 3 sample quotes, 4 customers, and your full crew loaded. Start by reviewing a quote, sending it to a customer, or creating a new one. The app works on your phone too — same URL, full functionality.",
    highlight: null,
    action: null,
  },
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("onboarding_complete");
    if (done) setDismissed(true);
  }, []);

  if (dismissed) return null;

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  function handleNext() {
    if (isLast) {
      localStorage.setItem("onboarding_complete", "true");
      setDismissed(true);
      onComplete();
    } else {
      setStep(step + 1);
    }
  }

  function handleSkip() {
    localStorage.setItem("onboarding_complete", "true");
    setDismissed(true);
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {step + 1} / {steps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {current.content}
          </p>

          {current.highlight && (
            <div className="text-xs text-primary font-mono bg-primary/5 border border-primary/20 rounded px-3 py-2 mb-4">
              {current.action} →{" "}
              <a href={current.highlight} className="underline">
                {current.highlight}
              </a>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div>
              {!isFirst && (
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isLast && (
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                  Skip tour
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {isLast ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
