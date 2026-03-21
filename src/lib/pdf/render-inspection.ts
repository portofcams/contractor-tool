/**
 * Inspection Report PDF Renderer
 *
 * Takes scan data (from LiDAR or manual entry) and generates
 * a professional inspection report PDF.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { InspectionPDF, type InspectionPDFData } from "./inspection-template";
import { format } from "date-fns";
import type { ScanResult } from "@/lib/room-scanner";

interface InspectionContext {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyLogo?: string;
  projectName?: string;
  projectAddress?: string;
  customerName?: string;
  quoteNumber?: string;
  photos?: { src: string; caption?: string }[];
  scanCount?: number;
  calibrated?: boolean;
}

export async function renderInspectionPDF(
  scan: ScanResult,
  context: InspectionContext
): Promise<Buffer> {
  const data: InspectionPDFData = {
    companyName: context.companyName,
    companyEmail: context.companyEmail,
    companyPhone: context.companyPhone,
    companyLogo: context.companyLogo
      ? context.companyLogo.startsWith("http")
        ? context.companyLogo
        : `${process.cwd()}/public${context.companyLogo}`
      : undefined,
    projectName: context.projectName,
    projectAddress: context.projectAddress,
    customerName: context.customerName,
    quoteNumber: context.quoteNumber,
    inspectionDate: format(new Date(), "MMMM d, yyyy"),
    rooms: scan.rooms.map((r) => ({
      name: r.name,
      length: r.length,
      width: r.width,
      height: r.height,
      floorArea: r.floorArea,
      wallArea: r.wallArea,
      confidence: r.confidence,
      accuracyPct: r.accuracyPct,
      accuracyInches: r.accuracyInches,
      nearbyWalls: r.nearbyWalls,
    })),
    overallScore: scan.confidence.overallScore,
    overallGrade: scan.confidence.overallGrade,
    coveragePct: scan.confidence.coveragePct,
    shouldVerify: scan.confidence.shouldVerify,
    recommendations: scan.confidence.recommendations,
    wallCount: scan.wallCount,
    doorCount: scan.doorCount,
    windowCount: scan.windowCount,
    wallDetails: scan.confidence.wallDetails,
    doorDetails: scan.confidence.doorDetails,
    windowDetails: scan.confidence.windowDetails,
    photos: context.photos,
    scanCount: context.scanCount ?? 1,
    calibrated: context.calibrated ?? false,
  };

  const buffer = await renderToBuffer(
    React.createElement(InspectionPDF, { data }) as any
  );

  return Buffer.from(buffer);
}
