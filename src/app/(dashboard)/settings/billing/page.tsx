import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { PLANS, getPlan, getQuotesRemaining } from "@/lib/stripe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingActions } from "./actions";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const contractor = await getContractor();
  const currentPlan = getPlan(contractor.subscriptionPlan);

  // Count quotes this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const quotesThisMonth = await prisma.quote.count({
    where: {
      contractorId: contractor.id,
      createdAt: { gte: thisMonth },
    },
  });

  const remaining = getQuotesRemaining(
    contractor.subscriptionPlan,
    quotesThisMonth
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Billing & Plan</h1>

      {params.success && (
        <div className="bg-green-500/10 text-green-400 p-4 rounded-lg text-sm">
          Subscription activated! Your plan has been upgraded.
        </div>
      )}
      {params.canceled && (
        <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg text-sm">
          Checkout canceled. No changes were made.
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge
              variant={currentPlan.id === "free" ? "outline" : "default"}
              className="text-sm"
            >
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">
              {currentPlan.price === 0 ? "Free" : `$${currentPlan.price}`}
            </span>
            {currentPlan.price > 0 && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>

          {/* Usage */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Quotes this month</span>
              <span className="font-medium">
                {quotesThisMonth}
                {remaining !== null ? ` / ${currentPlan.quotesPerMonth}` : ""}
              </span>
            </div>
            {remaining !== null && (
              <div className="w-full bg-[#333842] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    remaining === 0
                      ? "bg-red-500"
                      : remaining <= 2
                      ? "bg-yellow-500"
                      : "bg-amber-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (quotesThisMonth / (currentPlan.quotesPerMonth || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            )}
            {remaining !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                {remaining === 0
                  ? "Limit reached \u2014 upgrade to continue"
                  : `${remaining} quotes remaining`}
              </p>
            )}
            {remaining === null && (
              <p className="text-xs text-muted-foreground mt-1">Unlimited quotes</p>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-1">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>

          <BillingActions
            currentPlan={currentPlan.id}
            hasStripeCustomer={!!contractor.stripeCustomerId}
          />
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="grid md:grid-cols-3 gap-4">
        {(Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][]).map(
          (plan) => (
            <Card
              key={plan.id}
              className={
                plan.id === currentPlan.id
                  ? "border-amber-500 border-2"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.id === currentPlan.id && (
                    <Badge>Current</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm">/mo</span>
                  )}
                </div>
                {plan.price > 0 && (
                  <p className="text-xs text-amber-500">14-day free trial</p>
                )}
                <ul className="space-y-1 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-green-400 text-xs">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
