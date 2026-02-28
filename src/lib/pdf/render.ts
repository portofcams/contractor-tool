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
  };
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

  const data: QuotePDFData = {
    companyName: quote.contractor.companyName,
    companyEmail: quote.contractor.email,
    companyPhone: quote.contractor.phone ?? undefined,
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
  };

  // QuotePDF returns a <Document> — cast through any to satisfy renderToBuffer's strict generic
  const buffer = await renderToBuffer(
    React.createElement(QuotePDF, { data }) as any
  );

  return Buffer.from(buffer);
}
