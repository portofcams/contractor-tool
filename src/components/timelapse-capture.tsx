"use client";

import { useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimelapsePhoto {
  id: string;
  fileUrl: string;
  caption: string | null;
  takenAt: string;
}

interface TimelapseCaptureProps {
  jobId: string;
  quoteId: string;
  existingPhotos: TimelapsePhoto[];
}

export function TimelapseCapture({
  jobId,
  quoteId,
  existingPhotos,
}: TimelapseCaptureProps) {
  const [active, setActive] = useState(false);
  const [interval, setIntervalMin] = useState("60");
  const [photos, setPhotos] = useState(existingPhotos);
  const [capturing, setCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimelapse() {
    setActive(true);
    setStatusMessage("Timelapse active. Take photos manually or let the timer remind you.");

    const intervalMs = parseInt(interval) * 60 * 1000;
    timerRef.current = setInterval(() => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Timelapse Reminder", {
          body: "Time to take your next timelapse photo!",
          tag: `timelapse-${jobId}`,
        });
      }
      setStatusMessage("Time for the next photo!");
    }, intervalMs);

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function stopTimelapse() {
    setActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatusMessage("");
  }

  async function capturePhoto() {
    setCapturing(true);

    let dataUrl: string | null = null;

    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          width: 1200,
          height: 1200,
        });
        if (photo.base64String) {
          dataUrl = `data:image/${photo.format};base64,${photo.base64String}`;
        }
      } catch {
        setCapturing(false);
        return;
      }
    } else {
      fileRef.current?.click();
      setCapturing(false);
      return;
    }

    if (dataUrl) {
      await uploadPhoto(dataUrl);
    }
    setCapturing(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await uploadPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function uploadPhoto(dataUrl: string) {
    setStatusMessage("Uploading...");
    try {
      const blob = await fetch(dataUrl).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob, `timelapse-${Date.now()}.jpg`);
      formData.append("quoteId", quoteId);
      formData.append("photoType", "timelapse");
      formData.append(
        "caption",
        `Timelapse #${photos.length + 1} - ${new Date().toLocaleString()}`
      );

      const res = await fetch("/api/site-photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const photo = await res.json();
        setPhotos((prev) => [...prev, photo]);
        setStatusMessage(`Photo ${photos.length + 1} captured.`);
      } else {
        setStatusMessage("Upload failed.");
      }
    } catch {
      setStatusMessage("Upload failed.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Timelapse Documentation</h3>
        <span className="text-xs text-muted-foreground">
          {photos.length} photo{photos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {!active ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="timelapse-interval"
              className="text-sm text-muted-foreground"
            >
              Remind every
            </label>
            <Select value={interval} onValueChange={setIntervalMin}>
              <SelectTrigger id="timelapse-interval" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="0">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={startTimelapse} className="w-full gap-2">
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
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
            Start Timelapse
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400">Timelapse active</span>
            {interval !== "0" && (
              <span className="text-muted-foreground">
                (every {interval} min)
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={capturePhoto}
              disabled={capturing}
              className="flex-1 gap-2"
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
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
              </svg>
              {capturing ? "Capturing..." : "Take Photo"}
            </Button>
            <Button variant="destructive" onClick={stopTimelapse}>
              Stop
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {statusMessage && (
        <p className="text-xs text-muted-foreground">{statusMessage}</p>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.fileUrl}
                alt={photo.caption || `Timelapse ${i + 1}`}
                className="w-full aspect-square object-cover rounded-md"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded-b-md">
                #{i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
