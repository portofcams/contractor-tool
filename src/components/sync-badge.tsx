"use client";

import { useState, useEffect } from "react";
import { offlineStore } from "@/lib/offline-storage";

export function SyncBadge() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    async function checkPending() {
      try {
        const queue = await offlineStore.getSyncQueue();
        setPendingCount(queue.length);
      } catch {
        // ignore
      }
    }
    checkPending();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const interval = setInterval(checkPending, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline && pendingCount === 0) {
    return (
      <span
        className="w-2.5 h-2.5 rounded-full bg-green-500"
        title="Online"
        aria-label="Online"
      />
    );
  }

  if (isOffline) {
    return (
      <span className="flex items-center gap-1.5" title="Offline">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
        <span className="text-xs text-red-400">Offline</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5" title={`${pendingCount} items pending sync`}>
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" aria-hidden="true" />
      <span className="text-xs text-yellow-400">{pendingCount}</span>
    </span>
  );
}
