"use client";

import { useState, useEffect, useCallback } from "react";
import { offlineStore } from "@/lib/offline-storage";
import { fullSync } from "@/lib/sync-service";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://contractorcalc.com";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");

  const checkPending = useCallback(async () => {
    try {
      const queue = await offlineStore.getSyncQueue();
      setPendingCount(queue.length);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    checkPending();

    function handleOnline() {
      setIsOffline(false);
      // Auto-sync when back online
      triggerSync();
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check pending items periodically
    const interval = setInterval(checkPending, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function triggerSync() {
    if (syncing) return;
    setSyncing(true);
    setSyncResult("");

    try {
      const result = await fullSync(API_BASE);
      if (result.synced > 0) {
        setSyncResult(`Synced ${result.synced} item${result.synced !== 1 ? "s" : ""}`);
        setTimeout(() => setSyncResult(""), 3000);
      }
      await checkPending();
    } catch {
      setSyncResult("Sync failed");
      setTimeout(() => setSyncResult(""), 3000);
    }
    setSyncing(false);
  }

  // Show nothing if online with no pending items and no sync result
  if (!isOffline && pendingCount === 0 && !syncResult) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`text-white text-center text-sm py-2 px-4 ${
        isOffline ? "bg-blue-700" : syncResult ? "bg-green-700" : "bg-blue-700/90"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        {isOffline ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01" />
            </svg>
            You&apos;re offline — quotes will be saved locally and synced when back online.
            {pendingCount > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {pendingCount} pending
              </span>
            )}
          </>
        ) : syncResult ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {syncResult}
          </>
        ) : (
          <>
            {pendingCount > 0 && (
              <>
                <span>{pendingCount} item{pendingCount !== 1 ? "s" : ""} waiting to sync</span>
                <button
                  onClick={triggerSync}
                  disabled={syncing}
                  aria-label={syncing ? "Syncing pending items" : `Sync ${pendingCount} pending item${pendingCount !== 1 ? "s" : ""} now`}
                  aria-busy={syncing}
                  className="bg-white/20 px-2 py-0.5 rounded text-xs hover:bg-white/30"
                >
                  {syncing ? "Syncing..." : "Sync now"}
                </button>
              </>
            )}
          </>
        )}
      </span>
    </div>
  );
}
