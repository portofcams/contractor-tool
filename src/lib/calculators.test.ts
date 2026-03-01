import { describe, it, expect } from "vitest";
import {
  calculateFlooring,
  calculatePaint,
  calculateDrywall,
} from "./calculators";

describe("calculateFlooring", () => {
  it("calculates straight install with 10% waste", () => {
    const result = calculateFlooring({
      squareFootage: 100,
      materialType: "hardwood",
      installPattern: "straight",
    });
    expect(result.totalSqft).toBe(110); // 100 * 1.10
    expect(result.boxesNeeded).toBe(6); // ceil(110 / 20)
    expect(result.wasteFactor).toBe("10%");
    expect(result.materialType).toBe("hardwood");
  });

  it("defaults to straight (10% waste) when no pattern given", () => {
    const result = calculateFlooring({
      squareFootage: 200,
      materialType: "laminate",
    });
    expect(result.totalSqft).toBe(220);
    expect(result.boxesNeeded).toBe(Math.ceil(220 / 18)); // 13
    expect(result.wasteFactor).toBe("10%");
  });

  it("applies 15% waste for diagonal pattern", () => {
    const result = calculateFlooring({
      squareFootage: 100,
      materialType: "tile",
      installPattern: "diagonal",
    });
    expect(result.totalSqft).toBe(115);
    expect(result.boxesNeeded).toBe(Math.ceil(115 / 10)); // 12
    expect(result.wasteFactor).toBe("15%");
  });

  it("applies 20% waste for herringbone pattern", () => {
    const result = calculateFlooring({
      squareFootage: 100,
      materialType: "vinyl",
      installPattern: "herringbone",
    });
    expect(result.totalSqft).toBe(120);
    expect(result.boxesNeeded).toBe(Math.ceil(120 / 45)); // 3
    expect(result.wasteFactor).toBe("20%");
  });

  it("uses correct sqft per box for each material", () => {
    const materials = [
      { type: "hardwood" as const, perBox: 20 },
      { type: "laminate" as const, perBox: 18 },
      { type: "tile" as const, perBox: 10 },
      { type: "carpet" as const, perBox: 12 },
      { type: "vinyl" as const, perBox: 45 },
    ];
    for (const { type, perBox } of materials) {
      const result = calculateFlooring({
        squareFootage: 1000,
        materialType: type,
      });
      expect(result.boxesNeeded).toBe(Math.ceil(1100 / perBox));
    }
  });

  it("rounds up boxes (never under-orders)", () => {
    const result = calculateFlooring({
      squareFootage: 1,
      materialType: "hardwood",
    });
    expect(result.boxesNeeded).toBe(1); // even 1.1 sqft rounds up to 1 box
  });
});

describe("calculatePaint", () => {
  it("calculates interior paint gallons", () => {
    const result = calculatePaint({
      wallSqft: 700,
      ceilingSqft: 0,
      coats: 2,
      paintType: "interior",
    });
    // (700 + 0) * 2 = 1400 sqft / 350 coverage = 4 gallons
    expect(result.gallons).toBe(4);
    expect(result.totalSqft).toBe(1400);
    expect(result.coverage).toBe(350);
  });

  it("calculates exterior paint with lower coverage", () => {
    const result = calculatePaint({
      wallSqft: 900,
      ceilingSqft: 0,
      coats: 2,
      paintType: "exterior",
    });
    // 900 * 2 = 1800 / 300 = 6
    expect(result.gallons).toBe(6);
    expect(result.coverage).toBe(300);
  });

  it("calculates ceiling paint with higher coverage", () => {
    const result = calculatePaint({
      wallSqft: 0,
      ceilingSqft: 400,
      coats: 1,
      paintType: "ceiling",
    });
    // 400 * 1 = 400 / 400 = 1
    expect(result.gallons).toBe(1);
  });

  it("combines wall and ceiling sqft", () => {
    const result = calculatePaint({
      wallSqft: 500,
      ceilingSqft: 200,
      coats: 2,
      paintType: "interior",
    });
    // (500 + 200) * 2 = 1400 / 350 = 4
    expect(result.totalSqft).toBe(1400);
    expect(result.gallons).toBe(4);
  });

  it("rounds up gallons", () => {
    const result = calculatePaint({
      wallSqft: 100,
      ceilingSqft: 0,
      coats: 1,
      paintType: "interior",
    });
    // 100 / 350 = 0.286 → 1
    expect(result.gallons).toBe(1);
  });
});

describe("calculateDrywall", () => {
  it("calculates 4x8 sheets needed", () => {
    const result = calculateDrywall({
      wallSqft: 256,
      ceilingSqft: 0,
      sheetSize: "4x8",
    });
    // 256 / 32 = 8 sheets
    expect(result.sheets).toBe(8);
    expect(result.mudBuckets).toBe(1); // ceil(8/8)
    expect(result.tapeFeet).toBe(64); // ceil(256/4)
  });

  it("calculates 4x10 sheets", () => {
    const result = calculateDrywall({
      wallSqft: 200,
      ceilingSqft: 0,
      sheetSize: "4x10",
    });
    // 200 / 40 = 5 sheets
    expect(result.sheets).toBe(5);
  });

  it("calculates 4x12 sheets", () => {
    const result = calculateDrywall({
      wallSqft: 192,
      ceilingSqft: 0,
      sheetSize: "4x12",
    });
    // 192 / 48 = 4 sheets
    expect(result.sheets).toBe(4);
  });

  it("combines wall and ceiling sqft", () => {
    const result = calculateDrywall({
      wallSqft: 300,
      ceilingSqft: 200,
      sheetSize: "4x8",
    });
    // 500 / 32 = 15.625 → 16
    expect(result.sheets).toBe(16);
    expect(result.mudBuckets).toBe(2); // ceil(16/8)
    expect(result.tapeFeet).toBe(125); // ceil(500/4)
  });

  it("rounds up sheets (never under-orders)", () => {
    const result = calculateDrywall({
      wallSqft: 33,
      ceilingSqft: 0,
      sheetSize: "4x8",
    });
    // 33 / 32 = 1.03 → 2
    expect(result.sheets).toBe(2);
  });

  it("scales mud buckets correctly (1 per 8 sheets)", () => {
    const result = calculateDrywall({
      wallSqft: 320,
      ceilingSqft: 0,
      sheetSize: "4x8",
    });
    // 320 / 32 = 10 sheets → ceil(10/8) = 2 buckets
    expect(result.sheets).toBe(10);
    expect(result.mudBuckets).toBe(2);
  });
});
