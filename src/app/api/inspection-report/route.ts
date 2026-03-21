/**
 * POST /api/inspection-report
 *
 * Generates an inspection report PDF from scan data.
 * Returns the PDF as a downloadable file.
 */

import { NextRequest, NextResponse } from "next/server";
import { getContractor } from "@/lib/session";
import { renderInspectionPDF } from "@/lib/pdf/render-inspection";
import type { ScanResult } from "@/lib/room-scanner";

export async function POST(request: NextRequest) {
  try {
    const contractor = await getContractor();

    const body = await request.json();
    const { scan, projectName, projectAddress, customerName, quoteNumber } =
      body as {
        scan: ScanResult;
        projectName?: string;
        projectAddress?: string;
        customerName?: string;
        quoteNumber?: string;
      };

    if (!scan || !scan.rooms || scan.rooms.length === 0) {
      return NextResponse.json(
        { error: "Scan data with at least one room is required" },
        { status: 400 }
      );
    }

    const buffer = await renderInspectionPDF(scan, {
      companyName: contractor.companyName,
      companyEmail: contractor.email,
      companyPhone: contractor.phone ?? undefined,
      companyLogo: contractor.logoUrl ?? undefined,
      projectName,
      projectAddress,
      customerName,
      quoteNumber,
      scanCount: body.scanCount ?? 1,
      calibrated: body.calibrated ?? false,
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inspection-report-${new Date().toISOString().slice(0, 10)}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Inspection report generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate inspection report" },
      { status: 500 }
    );
  }
}
