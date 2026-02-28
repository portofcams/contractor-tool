import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultMaterials = [
  // Flooring
  { category: "flooring", materialType: "hardwood", unit: "sqft", costPerUnit: 5.0 },
  { category: "flooring", materialType: "laminate", unit: "sqft", costPerUnit: 2.5 },
  { category: "flooring", materialType: "tile", unit: "sqft", costPerUnit: 4.0 },
  { category: "flooring", materialType: "carpet", unit: "sqft", costPerUnit: 3.0 },
  { category: "flooring", materialType: "vinyl", unit: "sqft", costPerUnit: 2.0 },
  // Paint
  { category: "paint", materialType: "interior_paint", unit: "gallon", costPerUnit: 35.0 },
  { category: "paint", materialType: "exterior_paint", unit: "gallon", costPerUnit: 45.0 },
  { category: "paint", materialType: "ceiling_paint", unit: "gallon", costPerUnit: 30.0 },
  // Drywall
  { category: "drywall", materialType: "drywall_sheet_4x8", unit: "sheet", costPerUnit: 12.0 },
  { category: "drywall", materialType: "drywall_sheet_4x10", unit: "sheet", costPerUnit: 15.0 },
  { category: "drywall", materialType: "drywall_sheet_4x12", unit: "sheet", costPerUnit: 18.0 },
  { category: "drywall", materialType: "joint_compound", unit: "bucket", costPerUnit: 18.0 },
  { category: "drywall", materialType: "drywall_tape", unit: "foot", costPerUnit: 0.05 },
];

async function main() {
  console.log("Seeding default material costs...");

  for (const material of defaultMaterials) {
    await prisma.materialCost.upsert({
      where: {
        id: `default-${material.category}-${material.materialType}`,
      },
      update: { costPerUnit: material.costPerUnit },
      create: {
        id: `default-${material.category}-${material.materialType}`,
        contractorId: null,
        ...material,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
