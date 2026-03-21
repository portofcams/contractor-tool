"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  height = 300,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-col-resize overflow-hidden rounded-lg"
      style={{ height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After image (full background) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || "100%", maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L3 10L7 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 4L17 10L13 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded z-20">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded z-20">
        {afterLabel}
      </span>
    </div>
  );
}

/**
 * BeforeAfterGallery — shows all before/after photo pairs as sliders
 */
interface Photo {
  id: string;
  fileUrl: string;
  caption: string | null;
  photoType: string;
}

export function BeforeAfterGallery({ photos }: { photos: Photo[] }) {
  const beforePhotos = photos.filter((p) => p.photoType === "before");
  const afterPhotos = photos.filter((p) => p.photoType === "after");

  if (beforePhotos.length === 0 || afterPhotos.length === 0) return null;

  // Pair them up (by index)
  const pairs = beforePhotos.map((before, i) => ({
    before,
    after: afterPhotos[i] || afterPhotos[afterPhotos.length - 1],
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Before & After
      </h3>
      {pairs.map((pair, i) => (
        <div key={pair.before.id}>
          <BeforeAfterSlider
            beforeSrc={pair.before.fileUrl}
            afterSrc={pair.after.fileUrl}
            beforeLabel={pair.before.caption || "Before"}
            afterLabel={pair.after.caption || "After"}
            height={280}
          />
        </div>
      ))}
    </div>
  );
}
