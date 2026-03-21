/**
 * Inspection Report PDF Template — ContractorCalc
 *
 * Auto-generated site inspection report from LiDAR scan data.
 * Includes room dimensions, wall/floor areas, door/window details,
 * confidence ratings, and actionable recommendations.
 *
 * Designed to accompany quotes — provides professional documentation
 * that validates the measurements behind your estimate.
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

export interface InspectionPDFData {
  // Company
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyLogo?: string;

  // Project
  projectName?: string;
  projectAddress?: string;
  inspectionDate: string;
  quoteNumber?: string;

  // Customer
  customerName?: string;

  // Scan data
  rooms: {
    name: string;
    length: number;
    width: number;
    height: number;
    floorArea: number;
    wallArea: number;
    confidence: "high" | "medium" | "low";
    accuracyPct: number;
    accuracyInches: number;
    nearbyWalls: number;
  }[];

  // Confidence
  overallScore: number;
  overallGrade: "high" | "medium" | "low";
  coveragePct: number;
  shouldVerify: boolean;
  recommendations: string[];

  // Surfaces
  wallCount: number;
  doorCount: number;
  windowCount: number;
  wallDetails: {
    index: number;
    lengthFt: number;
    heightFt: number;
    confidence: "high" | "medium" | "low";
    accuracyInches: number;
    areaFt: number;
  }[];
  doorDetails: {
    index: number;
    widthFt: number;
    heightFt: number;
    areaFt: number;
  }[];
  windowDetails: {
    index: number;
    widthFt: number;
    heightFt: number;
    areaFt: number;
  }[];

  // Photos
  photos?: { src: string; caption?: string }[];

  // Scan metadata
  scanCount: number;
  calibrated: boolean;
}

// ── Colors (Apple-inspired) ──

const c = {
  primary: "#0071e3",
  primaryLight: "#e3f0ff",
  dark: "#1d1d1f",
  gray: "#86868b",
  lightGray: "#f5f5f7",
  border: "#d2d2d7",
  white: "#ffffff",
  green: "#34c759",
  greenLight: "#dcfce7",
  yellow: "#ff9500",
  yellowLight: "#fef9c3",
  red: "#ff3b30",
  redLight: "#fee2e2",
};

// ── Styles ──

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: c.dark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: c.primary,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: c.dark,
  },
  subtitle: {
    fontSize: 10,
    color: c.gray,
    marginTop: 2,
  },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: c.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: c.dark,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  text: { fontSize: 10, lineHeight: 1.5, color: c.dark },
  textGray: { fontSize: 10, lineHeight: 1.5, color: c.gray },
  textSmall: { fontSize: 9, color: c.gray },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  infoBlock: { width: "48%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: c.primary,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: c.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: c.border,
  },
  tableRowAlt: { backgroundColor: c.lightGray },
  footer: {
    marginTop: "auto",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
});

// ── Helpers ──

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function confColor(level: "high" | "medium" | "low") {
  return level === "high" ? c.green : level === "medium" ? c.yellow : c.red;
}

function confBg(level: "high" | "medium" | "low") {
  return level === "high" ? c.greenLight : level === "medium" ? c.yellowLight : c.redLight;
}

function confLabel(level: "high" | "medium" | "low") {
  return level === "high" ? "HIGH" : level === "medium" ? "MEDIUM" : "LOW";
}

// ── Component ──

export function InspectionPDF({ data }: { data: InspectionPDFData }) {
  const totalFloor = data.rooms.reduce((s, r) => s + r.floorArea, 0);
  const totalWall = data.rooms.reduce((s, r) => s + r.wallArea, 0);
  const totalDoorArea = data.doorDetails.reduce((s, d) => s + d.areaFt, 0);
  const totalWindowArea = data.windowDetails.reduce((s, w) => s + w.areaFt, 0);
  const paintableWall = totalWall - totalDoorArea - totalWindowArea;
  const perimeter = data.rooms.reduce((s, r) => s + 2 * (r.length + r.width), 0);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {data.companyLogo && (
              <Image src={data.companyLogo} style={{ width: 60, height: 60, objectFit: "contain" }} />
            )}
            <View>
              <Text style={s.title}>Site Inspection Report</Text>
              <Text style={s.subtitle}>{data.companyName}</Text>
              {data.companyPhone && <Text style={s.subtitle}>{data.companyPhone}</Text>}
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: c.dark }}>
              {data.inspectionDate}
            </Text>
            {data.quoteNumber && (
              <Text style={s.textGray}>Quote #{data.quoteNumber}</Text>
            )}
            {/* Overall confidence badge */}
            <View style={{
              marginTop: 6,
              paddingVertical: 3,
              paddingHorizontal: 10,
              backgroundColor: confBg(data.overallGrade),
              borderRadius: 4,
            }}>
              <Text style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: confColor(data.overallGrade),
              }}>
                {confLabel(data.overallGrade)} CONFIDENCE
              </Text>
            </View>
          </View>
        </View>

        {/* ── Project Info ── */}
        <View style={[s.row, { marginBottom: 16 }]}>
          <View style={s.infoBlock}>
            <Text style={s.label}>Project</Text>
            {data.projectName && <Text style={s.text}>{data.projectName}</Text>}
            {data.projectAddress && <Text style={s.textGray}>{data.projectAddress}</Text>}
            {data.customerName && <Text style={s.textGray}>Client: {data.customerName}</Text>}
          </View>
          <View style={s.infoBlock}>
            <Text style={s.label}>Scan Summary</Text>
            <Text style={s.text}>
              {data.rooms.length} room{data.rooms.length !== 1 ? "s" : ""} · {data.wallCount} walls · {data.doorCount} doors · {data.windowCount} windows
            </Text>
            <Text style={s.textGray}>
              Coverage: {fmt(data.coveragePct)}% · Score: {Math.round(data.overallScore)}/100
            </Text>
            <Text style={s.textGray}>
              {data.scanCount > 1 ? `${data.scanCount} scans averaged` : "Single scan"}
              {data.calibrated ? " · Calibrated" : ""}
            </Text>
          </View>
        </View>

        {/* ── Area Summary ── */}
        <View style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        }}>
          {[
            { label: "Total Floor", value: `${Math.round(totalFloor)} sqft` },
            { label: "Gross Wall", value: `${Math.round(totalWall)} sqft` },
            { label: "Paintable Wall", value: `${Math.round(paintableWall)} sqft` },
            { label: "Perimeter", value: `${Math.round(perimeter)} lf` },
          ].map((item, i) => (
            <View key={i} style={{
              flex: 1,
              padding: 8,
              backgroundColor: c.lightGray,
              borderRadius: 4,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: c.dark }}>
                {item.value}
              </Text>
              <Text style={{ fontSize: 8, color: c.gray, marginTop: 2 }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Room Detail Table ── */}
        <Text style={s.sectionTitle}>Room Measurements</Text>
        <View>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, { width: "18%" }]}>Room</Text>
            <Text style={[s.tableHeaderText, { width: "12%", textAlign: "right" }]}>Length</Text>
            <Text style={[s.tableHeaderText, { width: "12%", textAlign: "right" }]}>Width</Text>
            <Text style={[s.tableHeaderText, { width: "12%", textAlign: "right" }]}>Height</Text>
            <Text style={[s.tableHeaderText, { width: "14%", textAlign: "right" }]}>Floor</Text>
            <Text style={[s.tableHeaderText, { width: "14%", textAlign: "right" }]}>Walls</Text>
            <Text style={[s.tableHeaderText, { width: "18%", textAlign: "right" }]}>Accuracy</Text>
          </View>
          {data.rooms.map((room, i) => (
            <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={{ width: "18%", fontFamily: "Helvetica-Bold", fontSize: 10 }}>{room.name}</Text>
              <Text style={{ width: "12%", textAlign: "right" }}>{fmt(room.length)}&apos;</Text>
              <Text style={{ width: "12%", textAlign: "right" }}>{fmt(room.width)}&apos;</Text>
              <Text style={{ width: "12%", textAlign: "right" }}>{fmt(room.height)}&apos;</Text>
              <Text style={{ width: "14%", textAlign: "right" }}>{Math.round(room.floorArea)}</Text>
              <Text style={{ width: "14%", textAlign: "right" }}>{Math.round(room.wallArea)}</Text>
              <View style={{ width: "18%", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
                <View style={{
                  paddingVertical: 1,
                  paddingHorizontal: 5,
                  backgroundColor: confBg(room.confidence),
                  borderRadius: 3,
                }}>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: confColor(room.confidence) }}>
                    {confLabel(room.confidence)}
                  </Text>
                </View>
                <Text style={{ fontSize: 9 }}>
                  ±{room.accuracyInches <= 1 ? room.accuracyInches.toFixed(1) : Math.round(room.accuracyInches)}&quot;
                </Text>
              </View>
            </View>
          ))}
          {/* Totals row */}
          <View style={[s.tableRow, { borderTopWidth: 1.5, borderTopColor: c.primary }]}>
            <Text style={{ width: "18%", fontFamily: "Helvetica-Bold" }}>TOTAL</Text>
            <Text style={{ width: "12%" }} />
            <Text style={{ width: "12%" }} />
            <Text style={{ width: "12%" }} />
            <Text style={{ width: "14%", textAlign: "right", fontFamily: "Helvetica-Bold" }}>
              {Math.round(totalFloor)}
            </Text>
            <Text style={{ width: "14%", textAlign: "right", fontFamily: "Helvetica-Bold" }}>
              {Math.round(totalWall)}
            </Text>
            <Text style={{ width: "18%" }} />
          </View>
        </View>

        {/* ── Doors & Windows ── */}
        {(data.doorDetails.length > 0 || data.windowDetails.length > 0) && (
          <>
            <Text style={s.sectionTitle}>Doors & Windows</Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              {/* Doors */}
              {data.doorDetails.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { marginBottom: 4 }]}>Doors ({data.doorDetails.length})</Text>
                  {data.doorDetails.map((door, i) => (
                    <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}>
                      <Text style={s.textSmall}>Door {door.index + 1}</Text>
                      <Text style={s.textSmall}>{fmt(door.widthFt)}&apos; × {fmt(door.heightFt)}&apos; = {Math.round(door.areaFt)} sqft</Text>
                    </View>
                  ))}
                  <View style={{ borderTopWidth: 0.5, borderTopColor: c.border, paddingTop: 3, marginTop: 3 }}>
                    <Text style={[s.textSmall, { fontFamily: "Helvetica-Bold" }]}>
                      Total door area: {Math.round(totalDoorArea)} sqft
                    </Text>
                  </View>
                </View>
              )}
              {/* Windows */}
              {data.windowDetails.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { marginBottom: 4 }]}>Windows ({data.windowDetails.length})</Text>
                  {data.windowDetails.map((win, i) => (
                    <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}>
                      <Text style={s.textSmall}>Window {win.index + 1}</Text>
                      <Text style={s.textSmall}>{fmt(win.widthFt)}&apos; × {fmt(win.heightFt)}&apos; = {Math.round(win.areaFt)} sqft</Text>
                    </View>
                  ))}
                  <View style={{ borderTopWidth: 0.5, borderTopColor: c.border, paddingTop: 3, marginTop: 3 }}>
                    <Text style={[s.textSmall, { fontFamily: "Helvetica-Bold" }]}>
                      Total window area: {Math.round(totalWindowArea)} sqft
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* ── Contractor Estimates ── */}
        <Text style={s.sectionTitle}>Material Estimates</Text>
        <View style={{ gap: 6 }}>
          {[
            { label: "Flooring coverage", value: `${Math.round(totalFloor * 1.08)} sqft (8% waste)` },
            { label: "Paint (1 coat)", value: `${Math.ceil(paintableWall / 350)} gallons @ 350 sqft/gal` },
            { label: "Paint (2 coats)", value: `${Math.ceil((paintableWall * 2) / 350)} gallons` },
            { label: "Primer + 2 coats", value: `${Math.ceil((paintableWall * 3) / 350)} gallons` },
            { label: "Baseboard", value: `${Math.round(perimeter)} linear ft` },
            { label: "Crown molding", value: `${Math.round(perimeter)} linear ft` },
            { label: "Drywall (walls)", value: `${Math.ceil(totalWall / 32)} sheets (4'×8')` },
            { label: "Drywall (ceiling)", value: `${Math.ceil(totalFloor / 32)} sheets (4'×8')` },
          ].map((item, i) => (
            <View key={i} style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: i % 2 === 0 ? c.lightGray : c.white,
              borderRadius: 3,
            }}>
              <Text style={{ fontSize: 10, color: c.gray }}>{item.label}</Text>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Recommendations ── */}
        {data.recommendations.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Recommendations</Text>
            <View style={{
              padding: 10,
              backgroundColor: data.shouldVerify ? c.yellowLight : c.greenLight,
              borderRadius: 4,
              borderLeftWidth: 3,
              borderLeftColor: data.shouldVerify ? c.yellow : c.green,
            }}>
              {data.recommendations.map((rec, i) => (
                <Text key={i} style={{ fontSize: 10, color: c.dark, marginBottom: i < data.recommendations.length - 1 ? 4 : 0 }}>
                  {data.shouldVerify ? "⚠" : "✓"} {rec}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* ── Site Photos ── */}
        {data.photos && data.photos.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Site Photos</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {data.photos.slice(0, 6).map((photo, i) => (
                <View key={i} style={{ width: "31%" }}>
                  <Image src={photo.src} style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 3 }} />
                  {photo.caption && (
                    <Text style={{ fontSize: 7, color: c.gray, marginTop: 2 }}>{photo.caption}</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: c.primary, textAlign: "center", marginBottom: 8 }}>
            Measured with LiDAR — ContractorCalc
          </Text>
          <Text style={{ fontSize: 8, color: c.gray, textAlign: "center", lineHeight: 1.6 }}>
            This inspection report was generated using Apple LiDAR technology (RoomPlan API). Measurements are estimates
            {"\n"}with accuracy noted per room. For critical dimensions, verify with a tape measure where recommended.
            {"\n"}Generated {data.inspectionDate} · {data.companyName} · {data.companyEmail}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
