import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerActions } from "./customer-actions";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const quote = await prisma.quote.findUnique({
    where: { publicToken: token },
    include: {
      customer: true,
      contractor: { select: { companyName: true, phone: true, email: true, trade: true } },
    },
  });

  if (!quote) notFound();

  // Mark as viewed
  if (!quote.viewedAt) {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { viewedAt: new Date() },
    });
  }

  const materials = quote.materials as unknown as MaterialLine[];
  const tradeName = quote.trade.charAt(0).toUpperCase() + quote.trade.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">{quote.contractor.companyName}</h1>
          <p className="text-blue-200 mt-1">{tradeName} Services</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Quote header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Quote {quote.quoteNumber}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Prepared for {quote.customer.name}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(quote.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge
            variant={
              quote.status === "accepted"
                ? "default"
                : quote.status === "rejected"
                ? "destructive"
                : "secondary"
            }
            className="text-sm px-3 py-1"
          >
            {quote.status === "accepted"
              ? "Accepted"
              : quote.status === "rejected"
              ? "Declined"
              : "Pending"}
          </Badge>
        </div>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Services</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Item</th>
                  <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                  <th className="text-right p-3 font-medium text-gray-600">Unit Cost</th>
                  <th className="text-right p-3 font-medium text-gray-600">Total</th>
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

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Materials</span>
              <span>${quote.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Markup ({quote.markupPercent}%)
              </span>
              <span>
                ${(quote.subtotal * (quote.markupPercent / 100)).toFixed(2)}
              </span>
            </div>
            {quote.laborCost && quote.laborCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Labor</span>
                <span>${quote.laborCost.toFixed(2)}</span>
              </div>
            )}
            {quote.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({quote.taxRate}%)</span>
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
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span className="text-blue-700">
                ${quote.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Accept / Decline */}
        <CustomerActions
          token={token}
          currentStatus={quote.status}
          hasSignature={!!quote.signatureData}
        />

        {/* Contact info */}
        <Card>
          <CardContent className="pt-6 text-sm text-gray-500 text-center">
            <p>
              Questions? Contact {quote.contractor.companyName}
              {quote.contractor.phone && ` at ${quote.contractor.phone}`}
              {quote.contractor.email && ` or ${quote.contractor.email}`}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              This quote is valid for 30 days from the date above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
