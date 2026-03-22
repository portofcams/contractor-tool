/**
 * Role-based permissions for ProBuildCalc
 *
 * Roles:
 *   - owner: Full access (company owner, e.g. Chris)
 *   - manager: Full access (project managers, e.g. John)
 *   - lead: Can see line items, jobs, time tracking — but NO prices, costs, or margins
 *
 * Leads can:
 *   - View job details, schedules, notes
 *   - See material line items (name, qty, unit — no cost)
 *   - Clock in/out, log time
 *   - View/scan receipts (but not dollar amounts)
 *   - View crew assignments
 *
 * Leads cannot:
 *   - See unit costs, line totals, subtotals, totals, margins
 *   - Create or edit quotes
 *   - View invoices or billing
 *   - Change settings or manage team
 */

export type AppRole = "owner" | "manager" | "lead";

export function canSeePrices(role: string): boolean {
  return role === "owner" || role === "manager" || role === "admin";
}

export function canEditQuotes(role: string): boolean {
  return role === "owner" || role === "manager" || role === "admin";
}

export function canViewInvoices(role: string): boolean {
  return role === "owner" || role === "manager" || role === "admin";
}

export function canManageTeam(role: string): boolean {
  return role === "owner" || role === "manager" || role === "admin";
}

export function canEditSettings(role: string): boolean {
  return role === "owner" || role === "manager" || role === "admin";
}

/**
 * Strip price fields from a quote/materials for lead visibility
 */
export function stripPrices(quote: any): any {
  const stripped = { ...quote };
  delete stripped.subtotal;
  delete stripped.total;
  delete stripped.markupPercent;
  delete stripped.taxRate;
  delete stripped.laborCost;

  if (stripped.materials && Array.isArray(stripped.materials)) {
    stripped.materials = stripped.materials.map((m: any) => ({
      item: m.item,
      qty: m.qty,
      unit: m.unit,
      // no unitCost, no cost
    }));
  }

  return stripped;
}

/**
 * Strip price from a receipt for lead visibility
 */
export function stripReceiptPrices(receipt: any): any {
  const stripped = { ...receipt };
  delete stripped.total;
  delete stripped.subtotal;
  delete stripped.tax;
  if (stripped.items && Array.isArray(stripped.items)) {
    stripped.items = stripped.items.map((item: any) => ({
      description: item.description,
      category: item.category,
      // no amount
    }));
  }
  return stripped;
}
