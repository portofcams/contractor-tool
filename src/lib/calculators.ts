// ── Flooring Calculator ──

export type FlooringMaterial = "hardwood" | "laminate" | "tile" | "carpet" | "vinyl";
export type InstallPattern = "straight" | "diagonal" | "herringbone";

interface FlooringInput {
  squareFootage: number;
  materialType: FlooringMaterial;
  installPattern?: InstallPattern;
}

interface FlooringResult {
  totalSqft: number;
  boxesNeeded: number;
  wasteFactor: string;
  materialType: FlooringMaterial;
}

export function calculateFlooring(input: FlooringInput): FlooringResult {
  let wasteFactor = 1.1; // 10% default

  if (input.installPattern === "diagonal") wasteFactor = 1.15;
  if (input.installPattern === "herringbone") wasteFactor = 1.2;

  const totalSqft = input.squareFootage * wasteFactor;

  const sqftPerBox: Record<FlooringMaterial, number> = {
    hardwood: 20,
    laminate: 18,
    tile: 10,
    carpet: 12,
    vinyl: 45,
  };

  const boxesNeeded = Math.ceil(totalSqft / sqftPerBox[input.materialType]);

  return {
    totalSqft: Math.round(totalSqft),
    boxesNeeded,
    wasteFactor: ((wasteFactor - 1) * 100).toFixed(0) + "%",
    materialType: input.materialType,
  };
}

// ── Paint Calculator ──

export type PaintType = "interior" | "exterior" | "ceiling";

interface PaintInput {
  wallSqft: number;
  ceilingSqft: number;
  coats: number;
  paintType: PaintType;
}

interface PaintResult {
  gallons: number;
  totalSqft: number;
  coverage: number;
  paintType: PaintType;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const coverageRate: Record<PaintType, number> = {
    interior: 350,
    exterior: 300,
    ceiling: 400,
  };

  const rate = coverageRate[input.paintType];
  const totalSqft = (input.wallSqft + input.ceilingSqft) * input.coats;
  const gallonsNeeded = Math.ceil(totalSqft / rate);

  return {
    gallons: gallonsNeeded,
    totalSqft,
    coverage: rate,
    paintType: input.paintType,
  };
}

// ── Drywall Calculator ──

export type SheetSize = "4x8" | "4x10" | "4x12";

interface DrywallInput {
  wallSqft: number;
  ceilingSqft: number;
  sheetSize: SheetSize;
}

interface DrywallResult {
  sheets: number;
  mudBuckets: number;
  tapeFeet: number;
  sheetSize: SheetSize;
}

export function calculateDrywall(input: DrywallInput): DrywallResult {
  const totalSqft = input.wallSqft + input.ceilingSqft;

  const sheetSqft: Record<SheetSize, number> = {
    "4x8": 32,
    "4x10": 40,
    "4x12": 48,
  };

  const sheetsNeeded = Math.ceil(totalSqft / sheetSqft[input.sheetSize]);
  const mudBuckets = Math.ceil(sheetsNeeded / 8);
  const tapeFeet = Math.ceil(totalSqft / 4);

  return {
    sheets: sheetsNeeded,
    mudBuckets,
    tapeFeet,
    sheetSize: input.sheetSize,
  };
}

// ── Default Material Costs ──

export const defaultMaterialCosts = {
  flooring: {
    hardwood: { costPerUnit: 5.0, unit: "sqft" },
    laminate: { costPerUnit: 2.5, unit: "sqft" },
    tile: { costPerUnit: 4.0, unit: "sqft" },
    carpet: { costPerUnit: 3.0, unit: "sqft" },
    vinyl: { costPerUnit: 2.0, unit: "sqft" },
  },
  paint: {
    interior: { costPerUnit: 35.0, unit: "gallon" },
    exterior: { costPerUnit: 45.0, unit: "gallon" },
    ceiling: { costPerUnit: 30.0, unit: "gallon" },
  },
  drywall: {
    sheet_4x8: { costPerUnit: 12.0, unit: "sheet" },
    sheet_4x10: { costPerUnit: 15.0, unit: "sheet" },
    sheet_4x12: { costPerUnit: 18.0, unit: "sheet" },
    mud: { costPerUnit: 18.0, unit: "bucket" },
    tape: { costPerUnit: 0.05, unit: "foot" },
  },
} as const;
