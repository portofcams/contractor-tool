"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareToMarketplaceProps {
  templateId: string;
  templateName: string;
}

export function ShareToMarketplace({ templateId, templateName }: ShareToMarketplaceProps) {
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function share() {
    setSharing(true);
    try {
      const res = await fetch("/api/templates/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, description: description || null }),
      });
      if (res.ok) {
        setShared(true);
        setShowForm(false);
      }
    } catch {
      // silently fail
    } finally {
      setSharing(false);
    }
  }

  if (shared) {
    return (
      <span className="text-xs text-green-500">Shared</span>
    );
  }

  if (!showForm) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowForm(true)}
        className="text-xs"
      >
        Share
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-7 text-xs"
      />
      <Button size="sm" onClick={share} disabled={sharing} className="text-xs h-7">
        {sharing ? "..." : "Share"}
      </Button>
    </div>
  );
}
