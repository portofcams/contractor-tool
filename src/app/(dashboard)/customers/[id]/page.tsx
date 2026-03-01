import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloorPlanUpload, FloorPlanGallery } from "@/components/floor-plan-upload";
import { SitePhotos } from "@/components/site-photos";
import { SiteNotes } from "@/components/site-notes";

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
      floorPlans: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) notFound();

  const [sitePhotos, siteNotes] = await Promise.all([
    prisma.sitePhoto.findMany({
      where: { customerId: id, contractorId: contractor.id },
      orderBy: { takenAt: "desc" },
    }),
    prisma.siteNote.findMany({
      where: { customerId: id, contractorId: contractor.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.email || customer.phone || "No contact info"}</p>
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
                <span className="text-muted-foreground">Email:</span> {customer.email}
              </p>
            )}
            {customer.phone && (
              <p>
                <span className="text-muted-foreground">Phone:</span> {customer.phone}
              </p>
            )}
            {customer.address && (
              <p>
                <span className="text-muted-foreground">Address:</span>{" "}
                {customer.address}
              </p>
            )}
            {customer.notes && (
              <p>
                <span className="text-muted-foreground">Notes:</span> {customer.notes}
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
              <p className="text-muted-foreground text-sm">No quotes yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-secondary"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {quote.quoteNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{quote.trade}</p>
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

      {/* Floor Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Floor Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FloorPlanGallery
            floorPlans={customer.floorPlans.map((fp) => ({
              id: fp.id,
              fileUrl: fp.fileUrl,
              fileType: fp.fileType,
              createdAt: fp.createdAt,
            }))}
          />
          <FloorPlanUpload customerId={customer.id} />
        </CardContent>
      </Card>

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
            customerId={customer.id}
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
            customerId={customer.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
