"use client";

import { SubManager } from "@/components/sub-manager";

export default function SubcontractorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subcontractors</h1>
        <p className="text-muted-foreground">Manage your subcontractors and their bids</p>
      </div>
      <SubManager />
    </div>
  );
}
