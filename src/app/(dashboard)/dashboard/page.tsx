import Link from "next/link";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsageIndicator } from "@/components/usage-indicator";
import { DashboardCharts } from "./charts";

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

  const plan = getPlan(contractor.subscriptionPlan);

  const totalRevenue = await prisma.quote.aggregate({
    where: { contractorId: contractor.id, status: "accepted" },
    _sum: { total: true },
  });

  const winRate =
    totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;

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

      {/* Recent Quotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Quotes</CardTitle>
          <Link href="/quotes" className="text-sm text-blue-500 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="text-blue-500 hover:underline">
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
                    <span className="w-6 h-6 rounded-full bg-blue-500/15 text-blue-500 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.quoteCount} accepted quote{customer.quoteCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-blue-500">
                    ${customer.revenue.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
