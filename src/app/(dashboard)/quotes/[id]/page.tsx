import { notFound } from "next/navigation";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteActions } from "./actions";
import { SitePhotos } from "@/components/site-photos";
import { SiteNotes } from "@/components/site-notes";
import { VoiceRecorder } from "@/components/voice-recorder";
import { FollowUpManager } from "@/components/follow-up-manager";
import { RecurrenceSelector } from "@/components/recurrence-selector";
import { RevisionHistory } from "@/components/revision-history";
import { BeforeAfterGallery } from "@/components/before-after-slider";
import { Room3DViewer } from "@/components/room-3d-viewer";
import { ARMaterialPreviewButton } from "@/components/ar-material-preview";
import { QuoteComparison } from "@/components/quote-comparison";
import { SMSButton } from "@/components/sms-button";
import { ReviewRequest } from "@/components/review-request";

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

  // Fetch site photos, notes, voice notes, and follow-ups for this quote
  const [sitePhotos, siteNotes, voiceNotes, followUps, roomScans] = await Promise.all([
    prisma.sitePhoto.findMany({
      where: { quoteId: id, contractorId: contractor.id },
      orderBy: { takenAt: "desc" },
    }),
    prisma.siteNote.findMany({
      where: { quoteId: id, contractorId: contractor.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.voiceNote.findMany({
      where: { quoteId: id, contractorId: contractor.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.followUp.findMany({
      where: { quoteId: id, contractorId: contractor.id },
      orderBy: { reminderDate: "asc" },
    }),
    prisma.roomScan.findMany({
      where: { quoteId: id, contractorId: contractor.id, modelUrl: { not: null } },
      select: { id: true, modelUrl: true },
      take: 1,
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quote.quoteNumber}</h1>
          <p className="text-muted-foreground">
            {quote.customer.name} &middot;{" "}
            <span className="capitalize">{quote.trade}</span>
          </p>
          {quote.projectName && (
            <p className="text-sm font-medium mt-1">{quote.projectName}</p>
          )}
          {quote.address && (
            <p className="text-sm text-muted-foreground">{quote.address}</p>
          )}
          {quote.sqft && (
            <p className="text-sm text-muted-foreground">{quote.sqft.toLocaleString()} sqft</p>
          )}
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
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3" scope="col">Item</th>
                <th className="text-right p-3" scope="col">Qty</th>
                <th className="text-right p-3" scope="col">Unit Cost</th>
                <th className="text-right p-3" scope="col">Total</th>
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

      {/* AR Material Preview — flooring/painting only */}
      <ARMaterialPreviewButton trade={quote.trade} />

      {/* Competitor Quote Comparison */}
      <QuoteComparison myMaterials={materials} />

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

      {quote.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Project Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
          </CardContent>
        </Card>
      )}

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

      {/* Timeline */}
      {(quote.sentAt || quote.viewedAt || quote.acceptedAt) && (
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Created</span>
                <span className="ml-auto text-muted-foreground">
                  {new Date(quote.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              {quote.sentAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Sent to customer</span>
                  <span className="ml-auto text-muted-foreground">
                    {new Date(quote.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              )}
              {quote.viewedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>Viewed by customer</span>
                  <span className="ml-auto text-muted-foreground">
                    {new Date(quote.viewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              )}
              {quote.acceptedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Accepted</span>
                  <span className="ml-auto text-muted-foreground">
                    {new Date(quote.acceptedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3D Room Model */}
      {roomScans[0]?.modelUrl && (
        <Card>
          <CardContent className="pt-6">
            <Room3DViewer modelUrl={roomScans[0].modelUrl} />
          </CardContent>
        </Card>
      )}

      {/* Before/After Comparison */}
      <BeforeAfterGallery
        photos={sitePhotos.map((p) => ({
          id: p.id,
          fileUrl: p.fileUrl,
          caption: p.caption,
          photoType: p.photoType,
        }))}
      />

      {/* Site Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Site Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <SitePhotos
            photos={sitePhotos.map((p) => ({
              id: p.id,
              fileUrl: p.fileUrl,
              caption: p.caption,
              photoType: p.photoType,
              takenAt: p.takenAt.toISOString(),
            }))}
            customerId={quote.customerId}
            quoteId={quote.id}
          />
        </CardContent>
      </Card>

      {/* Site Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Site Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteNotes
            notes={siteNotes.map((n) => ({
              id: n.id,
              content: n.content,
              createdAt: n.createdAt.toISOString(),
              updatedAt: n.updatedAt.toISOString(),
            }))}
            customerId={quote.customerId}
            quoteId={quote.id}
          />
        </CardContent>
      </Card>

      {/* Voice Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <VoiceRecorder
            notes={voiceNotes.map((v) => ({
              id: v.id,
              fileUrl: v.fileUrl,
              duration: v.duration,
              createdAt: v.createdAt.toISOString(),
            }))}
            customerId={quote.customerId}
            quoteId={quote.id}
          />
        </CardContent>
      </Card>

      {/* Follow-up Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <FollowUpManager
            quoteId={quote.id}
            followUps={followUps.map((f) => ({
              id: f.id,
              reminderDate: f.reminderDate.toISOString(),
              message: f.message,
              status: f.status,
              isAuto: f.isAuto,
              stepIndex: f.stepIndex,
            }))}
          />
        </CardContent>
      </Card>

      {/* Revision History */}
      <Card>
        <CardContent className="pt-6">
          <RevisionHistory quoteId={quote.id} currentVersion={quote.version} />
        </CardContent>
      </Card>

      <RecurrenceSelector
        quoteId={quote.id}
        currentRecurrence={quote.recurrence}
        nextRecurrenceAt={quote.nextRecurrenceAt?.toISOString() ?? null}
      />

      {/* SMS & Review Actions */}
      {(quote.customer.phone || quote.customer.email) && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {quote.status === "sent" && (
              <SMSButton
                type="quote_sent"
                customerId={quote.customerId}
                quoteId={quote.id}
                customerPhone={quote.customer.phone ?? undefined}
                label="SMS Quote Link"
              />
            )}
            {quote.status === "accepted" && (
              <ReviewRequest
                customerId={quote.customerId}
                quoteId={quote.id}
                customerEmail={quote.customer.email ?? undefined}
              />
            )}
          </CardContent>
        </Card>
      )}

      <QuoteActions
        quoteId={quote.id}
        currentStatus={quote.status}
        customerEmail={quote.customer.email ?? undefined}
        publicToken={quote.publicToken}
        quoteData={{
          trade: quote.trade,
          materials: quote.materials as unknown as Record<string, unknown>[],
          markupPercent: quote.markupPercent,
          laborCost: quote.laborCost ?? undefined,
          taxRate: quote.taxRate,
        }}
      />
    </div>
  );
}
