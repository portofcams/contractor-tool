"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultMaterialCosts } from "@/lib/calculators";

type Trade = "flooring" | "painting" | "drywall";
type FlooringType = "hardwood" | "laminate" | "tile" | "carpet" | "vinyl";

const MARKUP = 1.5; // 50% markup
const PAINT_COVERAGE_SQFT = 350;
const PAINT_COATS = 2;
const DRYWALL_SHEET_SQFT = 32;

export default function QuickEstimatePage() {
  const [trade, setTrade] = useState<Trade>("flooring");
  const [sqft, setSqft] = useState("");
  const [flooringType, setFlooringType] = useState<FlooringType>("hardwood");

  const squareFootage = parseFloat(sqft) || 0;

  function calculateEstimate(): number {
    if (squareFootage <= 0) return 0;

    switch (trade) {
      case "flooring": {
        const costPerSqft =
          defaultMaterialCosts.flooring[flooringType].costPerUnit;
        return squareFootage * costPerSqft * MARKUP;
      }
      case "painting": {
        const costPerGallon = defaultMaterialCosts.paint.interior.costPerUnit;
        const gallonsNeeded = Math.ceil(
          (squareFootage * PAINT_COATS) / PAINT_COVERAGE_SQFT
        );
        return gallonsNeeded * costPerGallon * MARKUP;
      }
      case "drywall": {
        const sheetsNeeded = Math.ceil(squareFootage / DRYWALL_SHEET_SQFT);
        const sheetCost =
          defaultMaterialCosts.drywall.sheet_4x8.costPerUnit * sheetsNeeded;
        const mudBuckets = Math.ceil(sheetsNeeded / 8);
        const mudCost =
          defaultMaterialCosts.drywall.mud.costPerUnit * mudBuckets;
        const tapeFeet = Math.ceil(squareFootage / 4);
        const tapeCost =
          defaultMaterialCosts.drywall.tape.costPerUnit * tapeFeet;
        return (sheetCost + mudCost + tapeCost) * MARKUP;
      }
      default:
        return 0;
    }
  }

  const estimate = calculateEstimate();

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Quick Estimate</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get a ballpark price in seconds
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estimate Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Trade</Label>
            <Select
              value={trade}
              onValueChange={(v) => setTrade(v as Trade)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flooring">Flooring</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="drywall">Drywall</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {trade === "flooring" && (
            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select
                value={flooringType}
                onValueChange={(v) => setFlooringType(v as FlooringType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardwood">
                    Hardwood ($5.00/sqft)
                  </SelectItem>
                  <SelectItem value="laminate">
                    Laminate ($2.50/sqft)
                  </SelectItem>
                  <SelectItem value="tile">Tile ($4.00/sqft)</SelectItem>
                  <SelectItem value="carpet">
                    Carpet ($3.00/sqft)
                  </SelectItem>
                  <SelectItem value="vinyl">Vinyl ($2.00/sqft)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Square Footage</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              min="0"
            />
          </div>

          {trade === "painting" && (
            <p className="text-xs text-muted-foreground">
              Based on interior paint at $35/gal, {PAINT_COVERAGE_SQFT} sqft
              coverage, {PAINT_COATS} coats
            </p>
          )}
          {trade === "drywall" && (
            <p className="text-xs text-muted-foreground">
              Based on 4x8 sheets at $12/sheet, plus mud and tape
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Estimated Price (with 50% markup)
          </p>
          <p className="text-5xl font-bold tracking-tight">
            ${estimate.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          {squareFootage > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {squareFootage.toLocaleString()} sqft &middot;{" "}
              <span className="capitalize">{trade}</span>
              {trade === "flooring" && (
                <span>
                  {" "}
                  &middot; <span className="capitalize">{flooringType}</span>
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      <Link href="/quotes/new" className="block">
        <Button className="w-full" size="lg">
          Create Full Quote
        </Button>
      </Link>
    </div>
  );
}
