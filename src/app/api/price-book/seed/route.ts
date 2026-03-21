import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const defaultItems = [
  // Flooring Materials
  { name: "Evolv LVP - Sandstone Oak", category: "flooring", materialType: "evolv_lvp_sandstone", itemType: "material", unit: "sqft", costPerUnit: 4.29, wasteFactor: 0.08, sortOrder: 1 },
  { name: "Evolv LVP - Midnight Walnut", category: "flooring", materialType: "evolv_lvp_midnight", itemType: "material", unit: "sqft", costPerUnit: 4.29, wasteFactor: 0.08, sortOrder: 2 },
  { name: "Shaw Floorté Plus", category: "flooring", materialType: "shaw_foorte", itemType: "material", unit: "sqft", costPerUnit: 3.89, wasteFactor: 0.08, sortOrder: 3 },
  { name: "Underlayment - 3mm Foam", category: "flooring", materialType: "underlayment_3mm", itemType: "material", unit: "sqft", costPerUnit: 0.45, wasteFactor: 0.08, sortOrder: 4 },
  { name: "Transition Strips", category: "flooring", materialType: "transition_strips", itemType: "material", unit: "ea", costPerUnit: 12.50, wasteFactor: 0, sortOrder: 5 },
  { name: "Adhesive (Glue-Down)", category: "flooring", materialType: "adhesive_glue", itemType: "material", unit: "sqft", costPerUnit: 1.20, wasteFactor: 0.08, sortOrder: 6 },
  { name: "Quarter Round Molding", category: "flooring", materialType: "quarter_round", itemType: "material", unit: "lf", costPerUnit: 1.25, wasteFactor: 0, sortOrder: 7 },

  // Flooring Labor
  { name: "Floating Floor Install", category: "flooring", materialType: "install_floating", itemType: "labor", unit: "sqft", costPerUnit: 2.50, wasteFactor: 0, sortOrder: 10 },
  { name: "Glue-Down Install", category: "flooring", materialType: "install_gluedown", itemType: "labor", unit: "sqft", costPerUnit: 3.25, wasteFactor: 0, sortOrder: 11 },
  { name: "Demo Existing Floor", category: "flooring", materialType: "demo_floor", itemType: "labor", unit: "sqft", costPerUnit: 1.50, wasteFactor: 0, sortOrder: 12 },
  { name: "Floor Prep / Leveling", category: "flooring", materialType: "floor_prep", itemType: "labor", unit: "sqft", costPerUnit: 2.00, wasteFactor: 0, sortOrder: 13 },
  { name: "Furniture Move (per room)", category: "flooring", materialType: "furniture_move", itemType: "labor", unit: "ea", costPerUnit: 150.00, wasteFactor: 0, sortOrder: 14 },
  { name: "Baseboard Remove & Reinstall", category: "flooring", materialType: "baseboard_reinstall", itemType: "labor", unit: "lf", costPerUnit: 1.75, wasteFactor: 0, sortOrder: 15 },

  // Misc
  { name: "Dumpster Rental", category: "misc", materialType: "dumpster", itemType: "misc", unit: "ea", costPerUnit: 450.00, wasteFactor: 0, sortOrder: 20 },
  { name: "Delivery Fee", category: "misc", materialType: "delivery", itemType: "misc", unit: "ea", costPerUnit: 150.00, wasteFactor: 0, sortOrder: 21 },
  { name: "Permit Fee", category: "misc", materialType: "permit", itemType: "misc", unit: "ea", costPerUnit: 250.00, wasteFactor: 0, sortOrder: 22 },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if contractor already has items
  const existingCount = await prisma.materialCost.count({
    where: { contractorId: session.user.id, active: true },
  });

  if (existingCount > 0) {
    return NextResponse.json(
      { error: "Price book already has items. Delete existing items first to re-seed." },
      { status: 409 }
    );
  }

  const items = await prisma.materialCost.createMany({
    data: defaultItems.map((item) => ({
      ...item,
      contractorId: session.user.id,
    })),
  });

  return NextResponse.json({ created: items.count }, { status: 201 });
}
