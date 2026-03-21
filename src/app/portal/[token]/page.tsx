import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const customer = await prisma.customer.findFirst({
    where: { portalToken: token },
    include: {
      contractor: {
        select: { companyName: true, phone: true, email: true, trade: true },
      },
      quotes: {
        orderBy: { createdAt: "desc" },
        where: { status: { not: "draft" } },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
      jobs: {
        orderBy: { scheduledDate: "desc" },
        include: {
          quote: { select: { trade: true, quoteNumber: true } },
        },
      },
    },
  });

  if (!customer) notFound();

  const statusVariant = (status: string) =>
    status === "accepted" || status === "paid" || status === "completed"
      ? ("default" as const)
      : status === "rejected" || status === "cancelled"
      ? ("destructive" as const)
      : status === "sent" || status === "scheduled"
      ? ("secondary" as const)
      : ("outline" as const);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm opacity-80 mb-1">{customer.contractor.companyName}</p>
          <h1 className="text-2xl font-bold">Welcome, {customer.name}</h1>
          <p className="text-sm opacity-70 mt-1">Your quotes, invoices, and jobs in one place</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
        {/* Quotes */}
        <Card>
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.quotes.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No quotes yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quote/${quote.publicToken}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{quote.quoteNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="capitalize">{quote.trade}</span>
                        {quote.sentAt && (
                          <> &middot; Sent {new Date(quote.sentAt).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">${quote.total.toLocaleString()}</span>
                      <Badge variant={statusVariant(quote.status)}>{quote.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.invoices.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No invoices yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(inv.dueDate).toLocaleDateString()}
                        {inv.paidAmount > 0 && inv.status !== "paid" && (
                          <> &middot; ${inv.paidAmount.toLocaleString()} paid</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">${inv.amount.toLocaleString()}</span>
                      <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                      {inv.status !== "paid" && inv.stripePaymentLink && (
                        <a
                          href={inv.stripePaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary transition-colors"
                        >
                          Pay Now
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.jobs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No scheduled jobs.</p>
            ) : (
              <div className="space-y-2">
                {customer.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        <span className="capitalize">{job.quote.trade}</span> — {job.quote.quoteNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant(job.status)}>
                      {job.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{customer.contractor.companyName}</p>
            {customer.contractor.email && <p className="text-muted-foreground">{customer.contractor.email}</p>}
            {customer.contractor.phone && <p className="text-muted-foreground">{customer.contractor.phone}</p>}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pb-8">
          Powered by ContractorCalc
        </p>
      </div>
    </div>
  );
}
