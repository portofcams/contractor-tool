"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoomPhoto {
  id: string;
  fileUrl: string;
  caption: string | null;
  photoType: string;
  roomName: string | null;
  takenAt: string;
}

interface Props {
  rooms: { name: string }[];
  quoteId?: string;
  customerId?: string;
}

export function RoomPhotoGallery({ rooms, quoteId, customerId }: Props) {
  const [photos, setPhotos] = useState<RoomPhoto[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<RoomPhoto | null>(null);
  const [captionInput, setCaptionInput] = useState("");
  const [photoType, setPhotoType] = useState<"general" | "before" | "after">("general");
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredPhotos = activeRoom
    ? photos.filter((p) => p.roomName === activeRoom)
    : photos;

  async function handleUpload(file: File, roomName: string) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomName", roomName);
    formData.append("photoType", photoType);
    if (captionInput) formData.append("caption", captionInput);
    if (quoteId) formData.append("quoteId", quoteId);
    if (customerId) formData.append("customerId", customerId);

    try {
      const res = await fetch("/api/site-photos", { method: "POST", body: formData });
      if (res.ok) {
        const photo = await res.json();
        setPhotos((prev) => [photo, ...prev]);
        setCaptionInput("");
      }
    } catch {
      // silent fail
    }
    setUploading(false);
  }

  function triggerUpload(roomName: string) {
    setActiveRoom(roomName);
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && activeRoom) {
      handleUpload(file, activeRoom);
    }
    e.target.value = "";
  }

  async function handleDelete(photo: RoomPhoto) {
    try {
      await fetch(`/api/site-photos/${photo.id}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      if (lightbox?.id === photo.id) setLightbox(null);
    } catch {
      // silent
    }
  }

  const roomCounts = rooms.map((r) => ({
    name: r.name,
    count: photos.filter((p) => p.roomName === r.name).length,
  }));

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Room tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveRoom(null)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            !activeRoom
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          All ({photos.length})
        </button>
        {roomCounts.map((r) => (
          <button
            key={r.name}
            onClick={() => setActiveRoom(r.name)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
              activeRoom === r.name
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {r.name} ({r.count})
          </button>
        ))}
      </div>

      {/* Upload controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1">
          {(["general", "before", "after"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPhotoType(t)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full font-medium transition-all",
                photoType === t
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <input
          value={captionInput}
          onChange={(e) => setCaptionInput(e.target.value)}
          placeholder="Caption (optional)"
          className="h-8 text-xs rounded-lg border border-input bg-background px-3 flex-1 min-w-[120px]"
        />
        {/* Per-room upload buttons */}
        {rooms.map((r) => (
          <Button
            key={r.name}
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 shrink-0"
            onClick={() => triggerUpload(r.name)}
            disabled={uploading}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            {r.name}
          </Button>
        ))}
      </div>

      {/* Photo grid */}
      {filteredPhotos.length === 0 ? (
        <div className="py-8 text-center">
          <svg className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            No photos yet. Tap a room button above to add photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted/20 group"
            >
              <img
                src={photo.fileUrl}
                alt={photo.caption || `${photo.roomName} photo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                {photo.roomName && (
                  <span className="text-[9px] font-medium text-white/80">{photo.roomName}</span>
                )}
                {photo.caption && (
                  <span className="text-[8px] text-white/60 truncate">{photo.caption}</span>
                )}
              </div>
              {/* Type badge */}
              {photo.photoType !== "general" && (
                <span className={cn(
                  "absolute top-1.5 right-1.5 text-[7px] font-bold uppercase px-1.5 py-0.5 rounded",
                  photo.photoType === "before" ? "bg-yellow-500/80 text-black" : "bg-green-500/80 text-black"
                )}>
                  {photo.photoType}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.fileUrl}
              alt={lightbox.caption || "Photo"}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <div className="flex items-center justify-between mt-3 px-1">
              <div>
                {lightbox.roomName && (
                  <p className="text-sm font-medium text-white">{lightbox.roomName}</p>
                )}
                {lightbox.caption && (
                  <p className="text-xs text-white/60">{lightbox.caption}</p>
                )}
                <p className="text-[10px] text-white/30 mt-0.5">
                  {new Date(lightbox.takenAt).toLocaleDateString()} · {lightbox.photoType}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/20 text-white hover:bg-white/10"
                  onClick={() => handleDelete(lightbox)}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/20 text-white hover:bg-white/10"
                  onClick={() => setLightbox(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
