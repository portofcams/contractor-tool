import { getContractor } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";
import { MaterialPricing } from "./material-pricing";

export default async function SettingsPage() {
  const contractor = await getContractor();

  const fullContractor = await prisma.contractor.findUnique({
    where: { id: contractor.id },
  });

  if (!fullContractor) throw new Error("Contractor not found");

  // Get contractor's custom material costs
  const customMaterials = await prisma.materialCost.findMany({
    where: { contractorId: contractor.id },
    orderBy: { category: "asc" },
  });

  // Get default materials for reference
  const defaultMaterials = await prisma.materialCost.findMany({
    where: { contractorId: null },
    orderBy: { category: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            contractor={{
              companyName: fullContractor.companyName,
              email: fullContractor.email,
              phone: fullContractor.phone || "",
              trade: fullContractor.trade,
              defaultMarkup: fullContractor.defaultMarkup,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Material Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialPricing
            defaultMaterials={defaultMaterials.map((m) => ({
              id: m.id,
              category: m.category,
              materialType: m.materialType,
              unit: m.unit,
              costPerUnit: m.costPerUnit,
            }))}
            customMaterials={customMaterials.map((m) => ({
              id: m.id,
              category: m.category,
              materialType: m.materialType,
              unit: m.unit,
              costPerUnit: m.costPerUnit,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
