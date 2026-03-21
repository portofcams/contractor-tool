"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface TimelapsePhoto {
  id: string;
  fileUrl: string;
  caption: string | null;
  takenAt: string;
}

interface TimelapseViewerProps {
  photos: TimelapsePhoto[];
}

export function TimelapseViewer({ photos }: TimelapseViewerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1000); // ms per frame
  const [fullscreen, setFullscreen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime()
  );

  const stop = useCallback(() => {
    setPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= sortedPhotos.length - 1) {
            stop();
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, sortedPhotos.length, stop]);

  function play() {
    if (currentIndex >= sortedPhotos.length - 1) {
      setCurrentIndex(0);
    }
    setPlaying(true);
  }

  function toggleFullscreen() {
    if (!fullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }

  if (sortedPhotos.length < 2) return null;

  const current = sortedPhotos[currentIndex];
  const startTime = new Date(sortedPhotos[0].takenAt);
  const currentTime = new Date(current.takenAt);
  const elapsed = currentTime.getTime() - startTime.getTime();
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Timelapse</h3>
        <span className="text-xs text-muted-foreground">
          {sortedPhotos.length} frames
        </span>
      </div>

      {/* Main viewer */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <img
          src={current.fileUrl}
          alt={current.caption || `Frame ${currentIndex + 1}`}
          className="w-full aspect-video object-contain"
        />
        {/* Overlay info */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {sortedPhotos.length}
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          +{hours}h {minutes}m
        </div>
        {current.caption && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded truncate">
            {current.caption}
          </div>
        )}
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={sortedPhotos.length - 1}
        value={currentIndex}
        onChange={(e) => {
          setCurrentIndex(Number(e.target.value));
          if (playing) stop();
        }}
        className="w-full"
        aria-label="Timelapse scrubber"
      />

      {/* Controls */}
      <div className="flex items-center gap-2">
        {playing ? (
          <Button size="sm" variant="outline" onClick={stop}>
            Pause
          </Button>
        ) : (
          <Button size="sm" onClick={play}>
            Play
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          aria-label="Previous frame"
        >
          &lt;
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            setCurrentIndex(
              Math.min(sortedPhotos.length - 1, currentIndex + 1)
            )
          }
          disabled={currentIndex >= sortedPhotos.length - 1}
          aria-label="Next frame"
        >
          &gt;
        </Button>

        <div className="flex-1" />

        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="text-xs bg-secondary border border-border rounded px-2 py-1"
          aria-label="Playback speed"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1x</option>
          <option value={500}>2x</option>
          <option value={250}>4x</option>
        </select>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </Button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {sortedPhotos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => {
              setCurrentIndex(i);
              if (playing) stop();
            }}
            className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
              i === currentIndex
                ? "border-primary"
                : "border-transparent hover:border-border"
            }`}
          >
            <img
              src={photo.fileUrl}
              alt={`Frame ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
