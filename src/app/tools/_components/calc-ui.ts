// Shared styling + helpers for the interactive calculator client components.

export const inputCls =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

export const labelCls =
  "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1";

/** Parse a positive number from an input string; 0 if blank/invalid. */
export const num = (s: string): number => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Format a number for display: 1 decimal under 100, whole above. */
export const fmt = (n: number): string =>
  n.toLocaleString("en-US", { maximumFractionDigits: n < 100 ? 1 : 0 });
