"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyPortalLink({ portalToken }: { portalToken: string }) {
  const [copied, setCopied] = useState(false);

  const portalUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/portal/${portalToken}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = portalUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-1">
      <Button variant="outline" size="sm" onClick={copyLink}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.019a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.82" />
        </svg>
        {copied ? "Copied!" : "Share Portal Link"}
      </Button>
      <p className="text-xs text-muted-foreground truncate max-w-xs">/portal/{portalToken.slice(0, 8)}...</p>
    </div>
  );
}
