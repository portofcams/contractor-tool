import Link from "next/link";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuotesList } from "./QuotesList";

export default async function QuotesPage() {
  const contractor = await getContractor();

  const quotes = await prisma.quote.findMany({
    where: { contractorId: contractor.id },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Link href="/quotes/new">
          <Button>New Quote</Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No quotes yet.</p>
            <Link href="/quotes/new">
              <Button>Create Your First Quote</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <QuotesList
          quotes={quotes.map((q) => ({
            id: q.id,
            quoteNumber: q.quoteNumber,
            trade: q.trade,
            total: q.total,
            status: q.status,
            createdAt: q.createdAt.toISOString(),
            customer: { name: q.customer.name, email: q.customer.email },
          }))}
        />
      )}
    </div>
  );
}
