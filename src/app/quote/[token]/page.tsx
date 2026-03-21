import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sendQuoteViewedNotification } from "@/lib/email";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerActions } from "./customer-actions";
import { BeforeAfterGallery } from "@/components/before-after-slider";
import { Room3DViewer } from "@/components/room-3d-viewer";
import { ARMaterialPreviewButton } from "@/components/ar-material-preview";

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
      contractor: { select: { companyName: true, phone: true, email: true, trade: true, notifyOnView: true } },
      sitePhotos: { orderBy: { takenAt: "desc" } },
      roomScans: {
        where: { modelUrl: { not: null } },
        select: { id: true, modelUrl: true },
        take: 1,
      },
      invoices: {
        where: { status: { not: "paid" } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!quote) notFound();

  // Mark as viewed and notify contractor
  if (!quote.viewedAt) {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { viewedAt: new Date() },
    });

    // Send view notification (fire and forget)
    if (quote.contractor.notifyOnView) {
      sendQuoteViewedNotification({
        to: quote.contractor.email,
        companyName: quote.contractor.companyName,
        customerName: quote.customer.name,
        quoteNumber: quote.quoteNumber,
        total: quote.total,
      }).catch(() => {});
    }
  }

  const materials = quote.materials as unknown as MaterialLine[];
  const tradeName = quote.trade.charAt(0).toUpperCase() + quote.trade.slice(1);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-primary/30">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#f1f5f9]">{quote.contractor.companyName}</h1>
          <p className="text-blue-400 mt-1">{tradeName} Services</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Quote header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#f1f5f9]">
              Quote {quote.quoteNumber}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Prepared for {quote.customer.name}
            </p>
            <p className="text-gray-500 text-xs mt-1">
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
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground" scope="col">Item</th>
                  <th className="text-right p-3 font-medium text-muted-foreground" scope="col">Qty</th>
                  <th className="text-right p-3 font-medium text-muted-foreground" scope="col">Unit Cost</th>
                  <th className="text-right p-3 font-medium text-muted-foreground" scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3">{m.item}</td>
                    <td className="text-right p-3">
                      {m.qty} {m.unit}
                    </td>
                    <td className="text-right p-3">
                      {m.unitCost > 0 ? `$${m.unitCost.toFixed(2)}` : "\u2014"}
                    </td>
                    <td className="text-right p-3">
                      {m.cost > 0 ? `$${m.cost.toFixed(2)}` : "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AR Material Preview — flooring/painting only */}
        <ARMaterialPreviewButton trade={quote.trade} />

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Materials</span>
              <span>${quote.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Markup ({quote.markupPercent}%)
              </span>
              <span>
                ${(quote.subtotal * (quote.markupPercent / 100)).toFixed(2)}
              </span>
            </div>
            {quote.laborCost && quote.laborCost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Labor</span>
                <span>${quote.laborCost.toFixed(2)}</span>
              </div>
            )}
            {quote.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({quote.taxRate}%)</span>
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
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">
                ${quote.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Site Photos */}
        {quote.sitePhotos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Site Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quote.sitePhotos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.fileUrl}
                      alt={photo.caption || "Site photo"}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {photo.photoType !== "general" && (
                      <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded ${
                        photo.photoType === "before"
                          ? "bg-orange-500/80 text-white"
                          : "bg-green-500/80 text-white"
                      }`}>
                        {photo.photoType === "before" ? "Before" : "After"}
                      </span>
                    )}
                    {photo.caption && (
                      <p className="text-xs text-muted-foreground mt-1">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3D Room Model */}
        {quote.roomScans[0]?.modelUrl && (
          <Card>
            <CardHeader>
              <CardTitle>3D Room View</CardTitle>
            </CardHeader>
            <CardContent>
              <Room3DViewer modelUrl={quote.roomScans[0].modelUrl} roomName="Scanned Room" />
            </CardContent>
          </Card>
        )}

        {/* Before/After Comparison */}
        <BeforeAfterGallery
          photos={quote.sitePhotos.map((p) => ({
            id: p.id,
            fileUrl: p.fileUrl,
            caption: p.caption,
            photoType: p.photoType,
          }))}
        />

        {/* Pay Now — for accepted quotes with unpaid invoice */}
        {quote.status === "accepted" && quote.invoices[0]?.stripePaymentLink && (
          <Card className="border-primary/30">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Invoice {quote.invoices[0].invoiceNumber} — ${(quote.invoices[0].amount - quote.invoices[0].paidAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} due
              </p>
              <a
                href={quote.invoices[0].stripePaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
              >
                Pay Now
              </a>
            </CardContent>
          </Card>
        )}

        {/* Accept / Decline */}
        <CustomerActions
          token={token}
          currentStatus={quote.status}
          hasSignature={!!quote.signatureData}
        />

        {/* Contact info */}
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground text-center">
            <p>
              Questions? Contact {quote.contractor.companyName}
              {quote.contractor.phone && ` at ${quote.contractor.phone}`}
              {quote.contractor.email && ` or ${quote.contractor.email}`}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              This quote is valid for 30 days from the date above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
