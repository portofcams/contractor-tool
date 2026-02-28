"use client";

import { useEffect } from "react";

/**
 * CapacitorProvider — runs native init once on mount.
 *
 * Placed in the root layout so Capacitor plugins are ready
 * before any page renders. Only activates on native platforms.
 */
export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("@/lib/capacitor-init").then(({ initCapacitor }) => {
      initCapacitor();
    });
  }, []);

  return <>{children}</>;
}
