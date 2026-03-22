"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to check user role permissions in client components
 */
export function useRole() {
  const { data: session } = useSession();
  const role = session?.user?.role || "manager";

  return {
    role,
    canSeePrices: role === "owner" || role === "manager" || role === "admin",
    canEditQuotes: role === "owner" || role === "manager" || role === "admin",
    canViewInvoices: role === "owner" || role === "manager" || role === "admin",
    canManageTeam: role === "owner" || role === "admin",
    canEditSettings: role === "owner" || role === "manager" || role === "admin",
    isLead: role === "lead",
  };
}

/**
 * Component wrapper that only renders children if user can see prices
 */
export function PriceVisible({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { canSeePrices } = useRole();
  if (!canSeePrices) return <>{fallback}</>;
  return <>{children}</>;
}

/**
 * Component wrapper that only renders for managers/owners
 */
export function ManagerOnly({ children }: { children: React.ReactNode }) {
  const { canEditQuotes } = useRole();
  if (!canEditQuotes) return null;
  return <>{children}</>;
}
