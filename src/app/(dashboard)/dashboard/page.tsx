import Link from "next/link";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsageIndicator } from "@/components/usage-indicator";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {contractor.companyName}
          </h1>
          <p className="text-gray-500">Here&apos;s your overview</p>
        </div>
        <Link href="/quotes/new">
          <Button>New Quote</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
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
            <CardTitle className="text-sm font-medium text-gray-500">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

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
          <Link href="/quotes" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="text-blue-600 hover:underline">
                Create your first quote
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/quotes/${quote.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{quote.customer.name}</p>
                    <p className="text-sm text-gray-500">
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
    </div>
  );
}
