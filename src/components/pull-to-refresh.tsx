"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PullToRefreshProps {
  children: React.ReactNode;
}

export function PullToRefresh({ children }: PullToRefreshProps) {
  const router = useRouter();
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pullDistance = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      pullDistance.current = diff;
      setPulling(true);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance.current > threshold && !refreshing) {
      setRefreshing(true);
      router.refresh();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
    setPulling(false);
    pullDistance.current = 0;
    startY.current = 0;
  }, [refreshing, router]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef}>
      {(pulling || refreshing) && (
        <div className="flex justify-center py-3">
          <div
            className={`w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </div>
      )}
      {children}
    </div>
  );
}
