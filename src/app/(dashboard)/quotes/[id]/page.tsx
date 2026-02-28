import { notFound } from "next/navigation";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteActions } from "./actions";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contractor = await getContractor();

  const quote = await prisma.quote.findFirst({
    where: { id, contractorId: contractor.id },
    include: { customer: true },
  });

  if (!quote) notFound();

  const materials = quote.materials as unknown as MaterialLine[];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quote.quoteNumber}</h1>
          <p className="text-gray-500">
            {quote.customer.name} &middot;{" "}
            <span className="capitalize">{quote.trade}</span>
          </p>
        </div>
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
          className="text-base px-3 py-1"
        >
          {quote.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Item</th>
                <th className="text-right p-3">Qty</th>
                <th className="text-right p-3">Unit Cost</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{m.item}</td>
                  <td className="text-right p-3">
                    {m.qty} {m.unit}
                  </td>
                  <td className="text-right p-3">
                    {m.unitCost > 0 ? `$${m.unitCost.toFixed(2)}` : "—"}
                  </td>
                  <td className="text-right p-3">
                    {m.cost > 0 ? `$${m.cost.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Materials Subtotal</span>
            <span>${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Markup ({quote.markupPercent}%)</span>
            <span>
              ${(quote.subtotal * (quote.markupPercent / 100)).toFixed(2)}
            </span>
          </div>
          {quote.laborCost && quote.laborCost > 0 && (
            <div className="flex justify-between">
              <span>Labor</span>
              <span>${quote.laborCost.toFixed(2)}</span>
            </div>
          )}
          {quote.taxRate > 0 && (
            <div className="flex justify-between">
              <span>Tax ({quote.taxRate}%)</span>
              <span>
                $
                {(
                  (quote.subtotal * (1 + quote.markupPercent / 100) +
                    (quote.laborCost || 0)) *
                  (quote.taxRate / 100)
                ).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${quote.total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="font-medium">{quote.customer.name}</p>
          {quote.customer.email && <p>{quote.customer.email}</p>}
          {quote.customer.phone && <p>{quote.customer.phone}</p>}
          {quote.customer.address && <p>{quote.customer.address}</p>}
        </CardContent>
      </Card>

      <QuoteActions
        quoteId={quote.id}
        currentStatus={quote.status}
        customerEmail={quote.customer.email ?? undefined}
        publicToken={quote.publicToken}
      />
    </div>
  );
}
