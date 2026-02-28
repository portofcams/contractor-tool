"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TemplateActions({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteTemplate() {
    if (!confirm("Delete this template?")) return;
    setLoading(true);

    await fetch(`/api/templates/${templateId}`, { method: "DELETE" });

    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={deleteTemplate}
      disabled={loading}
      className="text-muted-foreground hover:text-red-400"
    >
      {loading ? "..." : "Delete"}
    </Button>
  );
}
