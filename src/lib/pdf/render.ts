/**
 * PDF Render Utility — ContractorCalc
 *
 * Server-side rendering of quote PDFs.
 * Uses @react-pdf/renderer's renderToBuffer to produce a PDF in memory,
 * which can then be returned as a response or attached to an email.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { QuotePDF, type QuotePDFData } from "./quote-template";
import { format } from "date-fns";

interface QuoteWithRelations {
  quoteNumber: string;
  trade: string;
  status: string;
  materials: unknown;
  subtotal: number;
  markupPercent: number;
  laborCost: number | null;
  taxRate: number;
  total: number;
  createdAt: Date;
  signatureData?: string | null;
  acceptedAt?: Date | null;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  contractor: {
    companyName: string;
    email: string;
    phone: string | null;
    logoUrl: string | null;
  };
  sitePhotos?: {
    fileUrl: string;
    caption: string | null;
    photoType: string;
  }[];
  roomScans?: {
    roomsData: unknown;
  }[];
}

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

export async function renderQuotePDF(quote: QuoteWithRelations): Promise<Buffer> {
  const materials = quote.materials as unknown as MaterialLine[];

  // Build logo path: if it's a full URL (R2), use as-is; if local path, resolve to filesystem
  const logoUrl = quote.contractor.logoUrl
    ? quote.contractor.logoUrl.startsWith("http")
      ? quote.contractor.logoUrl
      : `${process.cwd()}/public${quote.contractor.logoUrl}`
    : undefined;

  // Extract room data from room scans
  const rooms: { name: string; sqft: number }[] = [];
  if (quote.roomScans) {
    for (const scan of quote.roomScans) {
      const scanRooms = scan.roomsData as { name: string; floorArea?: number; length?: number; width?: number }[];
      if (Array.isArray(scanRooms)) {
        for (const r of scanRooms) {
          const sqft = r.floorArea ?? ((r.length ?? 0) * (r.width ?? 0));
          if (r.name && sqft > 0) rooms.push({ name: r.name, sqft: Math.round(sqft) });
        }
      }
    }
  }

  const data: QuotePDFData = {
    companyName: quote.contractor.companyName,
    companyEmail: quote.contractor.email,
    companyPhone: quote.contractor.phone ?? undefined,
    companyLogo: logoUrl,
    quoteNumber: quote.quoteNumber,
    date: format(quote.createdAt, "MMMM d, yyyy"),
    trade: quote.trade,
    status: quote.status,
    customerName: quote.customer.name,
    customerEmail: quote.customer.email ?? undefined,
    customerPhone: quote.customer.phone ?? undefined,
    customerAddress: quote.customer.address ?? undefined,
    materials,
    subtotal: quote.subtotal,
    markupPercent: quote.markupPercent,
    laborCost: quote.laborCost ?? undefined,
    taxRate: quote.taxRate,
    total: quote.total,
    rooms: rooms.length > 0 ? rooms : undefined,
    photos: quote.sitePhotos?.map((p) => ({
      src: p.fileUrl.startsWith("http")
        ? p.fileUrl
        : `${process.cwd()}/public${p.fileUrl}`,
      caption: p.caption ?? undefined,
      photoType: p.photoType,
    })),
    signatureData: quote.signatureData ?? undefined,
    acceptedAt: quote.acceptedAt
      ? format(quote.acceptedAt, "MMMM d, yyyy")
      : undefined,
  };

  // QuotePDF returns a <Document> — cast through any to satisfy renderToBuffer's strict generic
  const buffer = await renderToBuffer(
    React.createElement(QuotePDF, { data }) as any
  );

  return Buffer.from(buffer);
}
