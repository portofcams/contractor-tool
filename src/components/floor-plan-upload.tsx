"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ExtractedRoom {
  name: string;
  length: number;
  width: number;
  height: number;
  sqft: number;
}

interface FloorPlanUploadProps {
  customerId: string;
  onUpload?: (floorPlan: { id: string; fileUrl: string; fileType: string }) => void;
}

export function FloorPlanUpload({ customerId, onUpload }: FloorPlanUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("customerId", customerId);

      try {
        const res = await fetch("/api/floorplans", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Upload failed");
          setUploading(false);
          return;
        }

        const floorPlan = await res.json();
        onUpload?.(floorPlan);
        router.refresh();
      } catch {
        setError("Network error");
      }
      setUploading(false);
    },
    [customerId, onUpload, router]
  );

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload floor plan: drag and drop or click to browse"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isDragging
            ? "border-primary bg-primary/8"
            : "border-border hover:border-primary/50 hover:bg-secondary"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select floor plan file to upload"
        />
        <div className="space-y-2">
          <svg
            className="w-10 h-10 mx-auto text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          {uploading ? (
            <p className="text-sm text-primary">Uploading...</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drop a floor plan here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or PDF up to 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

interface FloorPlanPreviewProps {
  floorPlans: { id: string; fileUrl: string; fileType: string; createdAt: Date | string; roomsData?: unknown }[];
  onExtracted?: (rooms: ExtractedRoom[]) => void;
}

export function FloorPlanGallery({ floorPlans, onExtracted }: FloorPlanPreviewProps) {
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [extractError, setExtractError] = useState("");
  const [extractResult, setExtractResult] = useState<{
    rooms: ExtractedRoom[];
    totalSqft: number;
    notes: string;
  } | null>(null);

  async function handleExtract(id: string) {
    setExtractingId(id);
    setExtractError("");
    setExtractResult(null);

    try {
      const res = await fetch(`/api/floorplans/${id}/extract`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setExtractError(data.error || "Extraction failed");
        setExtractingId(null);
        return;
      }

      setExtractResult(data);
      onExtracted?.(data.rooms);
    } catch {
      setExtractError("Network error");
    }
    setExtractingId(null);
  }

  if (floorPlans.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {floorPlans.map((fp) => (
          <div
            key={fp.id}
            className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
          >
            <a href={fp.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
              {fp.fileType === "image" ? (
                <img
                  src={fp.fileUrl}
                  alt="Floor plan"
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-secondary flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 mx-auto text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <p className="text-xs text-muted-foreground mt-1">PDF</p>
                  </div>
                </div>
              )}
            </a>
            <div className="p-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {new Date(fp.createdAt).toLocaleDateString()}
              </p>
              {fp.fileType === "image" && (
                <Button
                  size="sm"
                  variant={fp.roomsData ? "outline" : "default"}
                  onClick={() => handleExtract(fp.id)}
                  disabled={extractingId !== null}
                  className="text-xs h-7 px-2"
                >
                  {extractingId === fp.id
                    ? "Analyzing..."
                    : fp.roomsData
                    ? "Re-extract"
                    : "AI Extract"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {extractError && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
          {extractError}
        </div>
      )}

      {extractResult && extractResult.rooms.length > 0 && (
        <div className="bg-primary/8 border border-primary/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              AI Extracted: {extractResult.rooms.length} room{extractResult.rooms.length !== 1 ? "s" : ""} — {extractResult.totalSqft.toLocaleString()} sqft
            </h4>
          </div>
          <div className="grid gap-2">
            {extractResult.rooms.map((room, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{room.name}</span>
                <span className="text-muted-foreground">
                  {room.length}&apos; x {room.width}&apos; = {room.sqft} sqft
                </span>
              </div>
            ))}
          </div>
          {extractResult.notes && (
            <p className="text-xs text-muted-foreground italic">{extractResult.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
