"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/stripe";

export function BillingActions({
  currentPlan,
  hasStripeCustomer,
}: {
  currentPlan: PlanId;
  hasStripeCustomer: boolean;
}) {
  const [loading, setLoading] = useState("");

  async function checkout(planId: PlanId) {
    setLoading(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading("");
  }

  async function openPortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading("");
  }

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {currentPlan === "free" && (
        <>
          <Button
            onClick={() => checkout("pro")}
            disabled={!!loading}
          >
            {loading === "pro" ? "Loading..." : "Upgrade to Pro — $29/mo"}
          </Button>
          <Button
            variant="outline"
            onClick={() => checkout("business")}
            disabled={!!loading}
          >
            {loading === "business"
              ? "Loading..."
              : "Upgrade to Business — $49/mo"}
          </Button>
        </>
      )}
      {currentPlan === "pro" && (
        <>
          <Button
            onClick={() => checkout("business")}
            disabled={!!loading}
          >
            {loading === "business"
              ? "Loading..."
              : "Upgrade to Business — $49/mo"}
          </Button>
          {hasStripeCustomer && (
            <Button
              variant="outline"
              onClick={openPortal}
              disabled={!!loading}
            >
              {loading === "portal" ? "Loading..." : "Manage Subscription"}
            </Button>
          )}
        </>
      )}
      {currentPlan === "business" && hasStripeCustomer && (
        <Button
          variant="outline"
          onClick={openPortal}
          disabled={!!loading}
        >
          {loading === "portal" ? "Loading..." : "Manage Subscription"}
        </Button>
      )}
    </div>
  );
}
