"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoadDefaults() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLoad() {
    setLoading(true);
    try {
      const res = await fetch("/api/templates/defaults", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleLoad} disabled={loading} variant="outline">
      {loading ? "Loading..." : "Load Default Templates"}
    </Button>
  );
}
