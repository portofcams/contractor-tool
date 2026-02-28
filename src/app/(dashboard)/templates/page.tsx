import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateActions } from "./actions";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

export default async function TemplatesPage() {
  const contractor = await getContractor();

  const templates = await prisma.quoteTemplate.findMany({
    where: { contractorId: contractor.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quote Templates</h1>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">No templates yet.</p>
            <p className="text-sm text-muted-foreground">
              Save a quote as a template from any quote detail page to reuse it later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => {
            const materials = template.materials as unknown as MaterialLine[];
            const subtotal = materials.reduce((s, m) => s + m.cost, 0);

            return (
              <Card key={template.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {template.trade}
                    </Badge>
                  </div>
                  <TemplateActions templateId={template.id} />
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="space-y-1">
                    {materials.map((m, i) => (
                      <div key={i} className="flex justify-between text-muted-foreground">
                        <span>{m.item}</span>
                        <span>{m.cost > 0 ? `$${m.cost.toFixed(2)}` : "\u2014"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between">
                    <span className="text-muted-foreground">Materials</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Markup</span>
                    <span>{template.markupPercent}%</span>
                  </div>
                  {template.laborCost && template.laborCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor</span>
                      <span>${template.laborCost.toFixed(2)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
