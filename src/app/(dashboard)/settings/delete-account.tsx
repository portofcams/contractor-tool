"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!password) {
      setError("Enter your password to confirm");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/settings/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        await signOut({ callbackUrl: "/login" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete account");
        setDeleting(false);
      }
    } catch {
      setError("Network error");
      setDeleting(false);
    }
  }

  if (!showConfirm) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data including customers, quotes, templates, and floor plans. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowConfirm(true)}
        >
          Delete Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border border-red-500/30 rounded-lg bg-red-500/5">
      <p className="text-sm font-medium text-red-400">
        Are you sure? This will permanently delete everything.
      </p>

      {error && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="delete-password" className="text-sm">
          Enter your password to confirm
        </Label>
        <Input
          id="delete-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, Delete Everything"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowConfirm(false);
            setPassword("");
            setError("");
          }}
          disabled={deleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
