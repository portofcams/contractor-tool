import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contractor = await getContractor();

  const customer = await prisma.customer.findFirst({
    where: { id, contractorId: contractor.id },
    include: {
      quotes: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-gray-500">{customer.email || customer.phone || "No contact info"}</p>
        </div>
        <Link href={`/quotes/new?customerId=${customer.id}`}>
          <Button>New Quote</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {customer.email && (
              <p>
                <span className="text-gray-500">Email:</span> {customer.email}
              </p>
            )}
            {customer.phone && (
              <p>
                <span className="text-gray-500">Phone:</span> {customer.phone}
              </p>
            )}
            {customer.address && (
              <p>
                <span className="text-gray-500">Address:</span>{" "}
                {customer.address}
              </p>
            )}
            {customer.notes && (
              <p>
                <span className="text-gray-500">Notes:</span> {customer.notes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.quotes.length === 0 ? (
              <p className="text-gray-500 text-sm">No quotes yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {quote.quoteNumber}
                      </p>
                      <p className="text-xs text-gray-500">{quote.trade}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${quote.total.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          quote.status === "accepted"
                            ? "default"
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
    </div>
  );
}
