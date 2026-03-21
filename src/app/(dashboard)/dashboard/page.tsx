import Link from "next/link";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsageIndicator } from "@/components/usage-indicator";
import dynamic from "next/dynamic";
const DashboardCharts = dynamic(() => import("./charts").then((m) => m.DashboardCharts), {
  loading: () => <div className="h-64 bg-secondary rounded-lg animate-pulse" />,
});
import { OnboardingChecklist } from "@/components/onboarding-checklist";

export default async function DashboardPage() {
  const contractor = await getContractor();

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const [totalQuotes, acceptedQuotes, recentQuotes, totalCustomers, quotesThisMonth] =
    await Promise.all([
      prisma.quote.count({ where: { contractorId: contractor.id } }),
      prisma.quote.count({
        where: { contractorId: contractor.id, status: "accepted" },
      }),
      prisma.quote.findMany({
        where: { contractorId: contractor.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { customer: true },
      }),
      prisma.customer.count({ where: { contractorId: contractor.id } }),
      prisma.quote.count({
        where: { contractorId: contractor.id, createdAt: { gte: thisMonth } },
      }),
    ]);

  // Recent activity: quotes viewed, accepted, or declined in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activityQuotes = await prisma.quote.findMany({
    where: {
      contractorId: contractor.id,
      OR: [
        { viewedAt: { gte: thirtyDaysAgo } },
        { acceptedAt: { gte: thirtyDaysAgo } },
        { sentAt: { gte: thirtyDaysAgo } },
        { status: "rejected", createdAt: { gte: thirtyDaysAgo } },
      ],
    },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  type ActivityItem = { type: string; date: Date; quoteNumber: string; customerName: string; total: number; quoteId: string };
  const activities: ActivityItem[] = [];
  for (const q of activityQuotes) {
    if (q.acceptedAt && q.acceptedAt >= thirtyDaysAgo) {
      activities.push({ type: "accepted", date: q.acceptedAt, quoteNumber: q.quoteNumber, customerName: q.customer.name, total: q.total, quoteId: q.id });
    }
    if (q.status === "rejected") {
      activities.push({ type: "declined", date: q.createdAt, quoteNumber: q.quoteNumber, customerName: q.customer.name, total: q.total, quoteId: q.id });
    }
    if (q.viewedAt && q.viewedAt >= thirtyDaysAgo) {
      activities.push({ type: "viewed", date: q.viewedAt, quoteNumber: q.quoteNumber, customerName: q.customer.name, total: q.total, quoteId: q.id });
    }
    if (q.sentAt && q.sentAt >= thirtyDaysAgo) {
      activities.push({ type: "sent", date: q.sentAt, quoteNumber: q.quoteNumber, customerName: q.customer.name, total: q.total, quoteId: q.id });
    }
  }
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const recentActivity = activities.slice(0, 8);

  const plan = getPlan(contractor.subscriptionPlan);

  // Onboarding checks
  const hasLogo = !!contractor.logoUrl;
  const hasCustomer = totalCustomers > 0;
  const hasQuote = totalQuotes > 0;
  const hasSentQuote = await prisma.quote.count({
    where: { contractorId: contractor.id, status: { not: "draft" } },
  }) > 0;

  const onboardingSteps = [
    { label: "Add your company logo", done: hasLogo, href: "/settings", cta: "Upload" },
    { label: "Add your first customer", done: hasCustomer, href: "/customers/new", cta: "Add" },
    { label: "Create your first quote", done: hasQuote, href: "/quotes/new", cta: "Create" },
    { label: "Send a quote to a client", done: hasSentQuote, href: "/quotes", cta: "Send" },
  ];
  const showOnboarding = onboardingSteps.some((s) => !s.done);

  const totalRevenue = await prisma.quote.aggregate({
    where: { contractorId: contractor.id, status: "accepted" },
    _sum: { total: true },
  });

  const winRate =
    totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;

  // Reviews summary
  const [submittedReviews, recentReviews] = await Promise.all([
    prisma.review.findMany({
      where: {
        contractorId: contractor.id,
        submittedAt: { not: null },
        rating: { not: null },
      },
      select: { rating: true },
    }),
    prisma.review.findMany({
      where: {
        contractorId: contractor.id,
        submittedAt: { not: null },
        rating: { not: null },
      },
      orderBy: { submittedAt: "desc" },
      take: 3,
      include: { customer: { select: { name: true } } },
    }),
  ]);

  const reviewCount = submittedReviews.length;
  const averageRating =
    reviewCount > 0
      ? submittedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewCount
      : 0;

  // Top customers by accepted revenue
  const topCustomers = await prisma.customer.findMany({
    where: { contractorId: contractor.id },
    select: {
      id: true,
      name: true,
      quotes: {
        where: { status: "accepted" },
        select: { total: true },
      },
    },
  });

  const topCustomersByRevenue = topCustomers
    .map((c) => ({
      id: c.id,
      name: c.name,
      revenue: c.quotes.reduce((sum, q) => sum + q.total, 0),
      quoteCount: c.quotes.length,
    }))
    .filter((c) => c.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {contractor.companyName}
          </h1>
          <p className="text-muted-foreground">Here&apos;s your overview</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/quotes/export" download>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </Button>
          </a>
          <Link href="/quotes/new">
            <Button>New Quote</Button>
          </Link>
        </div>
      </div>

      {showOnboarding && <OnboardingChecklist steps={onboardingSteps} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(totalRevenue._sum.total ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Usage Indicator (free tier) */}
      <UsageIndicator
        quotesThisMonth={quotesThisMonth}
        quotesLimit={plan.quotesPerMonth}
        planName={plan.name}
      />

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, i) => {
                const icon = a.type === "accepted" ? "bg-green-500/15 text-green-500"
                  : a.type === "declined" ? "bg-red-500/15 text-red-500"
                  : a.type === "viewed" ? "bg-primary/10 text-primary"
                  : "bg-yellow-500/15 text-yellow-500";
                const label = a.type === "accepted" ? "Accepted"
                  : a.type === "declined" ? "Declined"
                  : a.type === "viewed" ? "Viewed"
                  : "Sent";
                return (
                  <Link
                    key={`${a.quoteId}-${a.type}-${i}`}
                    href={`/quotes/${a.quoteId}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <span className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${icon}`}>
                      {label[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {a.customerName} — {a.quoteNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {label} · ${a.total.toLocaleString()} · {a.date.toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Quotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Quotes</CardTitle>
          <Link href="/quotes" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="text-primary hover:underline">
                Create your first quote
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/quotes/${quote.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="font-medium">{quote.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.quoteNumber} &middot; {quote.trade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${quote.total.toLocaleString()}
                    </p>
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
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Top Customers */}
      {topCustomersByRevenue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomersByRevenue.map((customer, i) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.quoteCount} accepted quote{customer.quoteCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-primary">
                    ${customer.revenue.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Customer Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewCount === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <p className="text-muted-foreground text-sm">No reviews yet. Send review requests after completing jobs.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-500" : "text-muted-foreground/25"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-3">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{review.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{review.submittedAt?.toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3.5 h-3.5 ${star <= (review.rating ?? 0) ? "text-yellow-500" : "text-muted-foreground/25"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
