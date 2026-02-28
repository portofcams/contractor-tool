/**
 * Quote PDF Template — ContractorCalc
 *
 * Renders a professional quote PDF using @react-pdf/renderer.
 * Used by the /api/quotes/[id]/pdf route to generate downloadable PDFs
 * and by the email service to attach PDFs to outbound emails.
 *
 * Layout:
 *   - Header: company name, quote number, date
 *   - Customer block: name, address, contact
 *   - Materials table: item, qty, unit cost, total
 *   - Pricing summary: subtotal, markup, labor, tax, total
 *   - Footer: thank you note, terms
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ── Types ──

export interface QuotePDFData {
  // Company
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyLogo?: string;

  // Quote
  quoteNumber: string;
  date: string;
  trade: string;
  status: string;

  // Customer
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;

  // Materials
  materials: {
    item: string;
    qty: number;
    unit: string;
    unitCost: number;
    cost: number;
  }[];

  // Pricing
  subtotal: number;
  markupPercent: number;
  laborCost?: number;
  taxRate: number;
  total: number;
}

// ── Styles ──

const colors = {
  primary: "#d97706",
  primaryLight: "#fef3c7",
  dark: "#111827",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  border: "#e5e7eb",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: colors.dark,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
    marginBottom: 4,
  },
  quoteNumber: {
    fontSize: 12,
    color: colors.gray,
  },
  headerDate: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },

  // Info blocks
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  infoBlock: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.dark,
  },
  infoTextLight: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.gray,
  },

  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: colors.lightGray,
  },
  colItem: { width: "40%" },
  colQty: { width: "20%", textAlign: "right" },
  colUnitCost: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  // Pricing summary
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  summaryBox: {
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },

  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
    marginBottom: 6,
  },
  footerText: {
    fontSize: 8,
    lineHeight: 1.6,
    color: colors.gray,
  },
  thankYou: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 15,
  },
});

// ── Helpers ──

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Component ──

export function QuotePDF({ data }: { data: QuotePDFData }) {
  const markupAmount = data.subtotal * (data.markupPercent / 100);
  const afterMarkup = data.subtotal + markupAmount;
  const afterLabor = afterMarkup + (data.laborCost || 0);
  const taxAmount = afterLabor * (data.taxRate / 100);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {data.companyLogo && (
              <Image src={data.companyLogo} style={{ width: 50, height: 50, objectFit: "contain" }} />
            )}
            <View>
              <Text style={styles.companyName}>{data.companyName}</Text>
              <Text style={styles.infoTextLight}>{data.companyEmail}</Text>
              {data.companyPhone && (
                <Text style={styles.infoTextLight}>{data.companyPhone}</Text>
              )}
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteLabel}>QUOTE</Text>
            <Text style={styles.quoteNumber}>{data.quoteNumber}</Text>
            <Text style={styles.headerDate}>{data.date}</Text>
            <Text style={styles.headerDate}>
              {data.trade.charAt(0).toUpperCase() + data.trade.slice(1)}
            </Text>
          </View>
        </View>

        {/* ── Customer & Project Info ── */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Prepared For</Text>
            <Text style={styles.infoText}>{data.customerName}</Text>
            {data.customerAddress && (
              <Text style={styles.infoTextLight}>{data.customerAddress}</Text>
            )}
            {data.customerEmail && (
              <Text style={styles.infoTextLight}>{data.customerEmail}</Text>
            )}
            {data.customerPhone && (
              <Text style={styles.infoTextLight}>{data.customerPhone}</Text>
            )}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Quote Details</Text>
            <Text style={styles.infoText}>Quote #: {data.quoteNumber}</Text>
            <Text style={styles.infoTextLight}>Date: {data.date}</Text>
            <Text style={styles.infoTextLight}>
              Valid for 30 days from date of issue
            </Text>
          </View>
        </View>

        {/* ── Materials Table ── */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, styles.colUnitCost]}>
              Unit Cost
            </Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {data.materials.map((m, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={styles.colItem}>{m.item}</Text>
              <Text style={styles.colQty}>
                {m.qty} {m.unit}
              </Text>
              <Text style={styles.colUnitCost}>
                {m.unitCost > 0 ? `$${fmt(m.unitCost)}` : "—"}
              </Text>
              <Text style={styles.colTotal}>
                {m.cost > 0 ? `$${fmt(m.cost)}` : "—"}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Pricing Summary ── */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Materials Subtotal</Text>
              <Text style={styles.summaryValue}>${fmt(data.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Markup ({data.markupPercent}%)
              </Text>
              <Text style={styles.summaryValue}>${fmt(markupAmount)}</Text>
            </View>
            {(data.laborCost ?? 0) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Labor</Text>
                <Text style={styles.summaryValue}>
                  ${fmt(data.laborCost!)}
                </Text>
              </View>
            )}
            {data.taxRate > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Tax ({data.taxRate}%)
                </Text>
                <Text style={styles.summaryValue}>${fmt(taxAmount)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${fmt(data.total)}</Text>
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for your business!</Text>
          <Text style={styles.footerTitle}>Terms & Conditions</Text>
          <Text style={styles.footerText}>
            1. This quote is valid for 30 days from the date of issue.{"\n"}
            2. A 50% deposit is required before work begins.{"\n"}
            3. Final payment is due upon completion of the project.{"\n"}
            4. Material prices are subject to change based on supplier availability.{"\n"}
            5. Any additional work beyond the scope of this quote will be billed
            separately.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
