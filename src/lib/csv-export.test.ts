import { describe, it, expect } from "vitest";

// Test the CSV escaping logic used in the export route
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

describe("CSV export helpers", () => {
  it("passes through simple strings", () => {
    expect(escapeCSV("hello")).toBe("hello");
    expect(escapeCSV("QT-001")).toBe("QT-001");
  });

  it("wraps strings with commas in quotes", () => {
    expect(escapeCSV("Smith, John")).toBe('"Smith, John"');
  });

  it("escapes double quotes by doubling them", () => {
    expect(escapeCSV('He said "hello"')).toBe('"He said ""hello"""');
  });

  it("wraps strings with newlines in quotes", () => {
    expect(escapeCSV("line1\nline2")).toBe('"line1\nline2"');
  });

  it("handles empty strings", () => {
    expect(escapeCSV("")).toBe("");
  });
});
