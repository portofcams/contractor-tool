"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SitePhoto {
  id: string;
  fileUrl: string;
  caption: string | null;
  photoType: string;
  takenAt: string;
}

export function SitePhotos({
  photos: initialPhotos,
  customerId,
  quoteId,
}: {
  photos: SitePhoto[];
  customerId?: string;
  quoteId?: string;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [photoType, setPhotoType] = useState("general");
  const [filterType, setFilterType] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap and Escape key for lightbox
  const handleLightboxKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
      if (e.key === "Tab" && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  // Manage focus when lightbox opens/closes
  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener("keydown", handleLightboxKeyDown);
      // Focus the close button in the lightbox
      setTimeout(() => {
        const closeBtn = lightboxRef.current?.querySelector<HTMLElement>("button");
        closeBtn?.focus();
      }, 0);
    } else {
      document.removeEventListener("keydown", handleLightboxKeyDown);
      // Return focus to the trigger button
      triggerRef.current?.focus();
    }
    return () => document.removeEventListener("keydown", handleLightboxKeyDown);
  }, [selectedPhoto, handleLightboxKeyDown]);

  async function handleUpload(file: File) {
    setUploading(true);
    setStatusMessage("Uploading photo...");
    const formData = new FormData();
    formData.append("file", file);
    if (customerId) formData.append("customerId", customerId);
    if (quoteId) formData.append("quoteId", quoteId);
    if (caption) formData.append("caption", caption);
    formData.append("photoType", photoType);

    try {
      const res = await fetch("/api/site-photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const photo = await res.json();
        setPhotos((prev) => [photo, ...prev]);
        setCaption("");
        setStatusMessage("Photo uploaded successfully.");
      } else {
        setStatusMessage("Photo upload failed.");
      }
    } catch {
      setStatusMessage("Photo upload failed.");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Site Photos</h3>
          <div className="flex gap-1">
            {(["all", "before", "after", "general"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                aria-pressed={filterType === t}
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  filterType === t ? "bg-blue-500 text-white border-blue-500" : "border-border text-muted-foreground"
                }`}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={photoType}
            onChange={(e) => setPhotoType(e.target.value)}
            aria-label="Photo type"
            className="h-8 text-xs rounded-md border border-border bg-background px-2"
          >
            <option value="general">General</option>
            <option value="before">Before</option>
            <option value="after">After</option>
          </select>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            aria-label="Photo caption"
            className="h-8 text-xs w-32"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            aria-label="Choose photo to upload"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-busy={uploading}
          >
            {uploading ? "Uploading..." : "Add Photo"}
          </Button>
        </div>
      </div>

      {(filterType === "all" ? photos : photos.filter(p => p.photoType === filterType)).length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No photos yet. Add photos from your job site visit.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="list" aria-label="Site photos">
          {(filterType === "all" ? photos : photos.filter(p => p.photoType === filterType)).map((photo) => (
            <button
              key={photo.id}
              role="listitem"
              onClick={() => {
                triggerRef.current = document.activeElement as HTMLButtonElement;
                setSelectedPhoto(photo);
              }}
              aria-label={`View photo${photo.caption ? `: ${photo.caption}` : ""}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-blue-500 transition-colors"
            >
              <img
                src={photo.fileUrl}
                alt={photo.caption || "Site photo"}
                className="w-full h-full object-cover"
              />
              {photo.photoType !== "general" && (
                <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  photo.photoType === "before" ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                }`} aria-hidden="true">
                  {photo.photoType}
                </span>
              )}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate" aria-hidden="true">
                  {photo.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo viewer${selectedPhoto.caption ? `: ${selectedPhoto.caption}` : ""}`}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 z-10"
              aria-label="Close photo viewer"
            >
              &times;
            </button>
            <img
              src={selectedPhoto.fileUrl}
              alt={selectedPhoto.caption || "Site photo"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-2">{selectedPhoto.caption}</p>
            )}
            <p className="text-muted-foreground text-xs text-center mt-1">
              {new Date(selectedPhoto.takenAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Live region for status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
    </div>
  );
}
