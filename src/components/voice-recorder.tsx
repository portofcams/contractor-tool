"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VoiceNote {
  id: string;
  fileUrl: string;
  duration: number;
  createdAt: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({
  customerId,
  quoteId,
  notes: initialNotes,
}: {
  customerId?: string;
  quoteId?: string;
  notes: VoiceNote[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function startRecording() {
    setStatusMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await uploadRecording(blob);
      };

      mediaRecorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } catch {
      setStatusMessage("Microphone access denied.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  async function uploadRecording(blob: Blob) {
    setUploading(true);
    setStatusMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", blob, "voice-note.webm");
    formData.append("duration", String(elapsed));
    if (customerId) formData.append("customerId", customerId);
    if (quoteId) formData.append("quoteId", quoteId);

    try {
      const res = await fetch("/api/voice-notes", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setStatusMessage("Voice note saved.");
      } else {
        setStatusMessage("Upload failed.");
      }
    } catch {
      setStatusMessage("Upload failed.");
    }
    setUploading(false);
  }

  function togglePlay(note: VoiceNote) {
    if (playingId === note.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(note.fileUrl);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.play();
    setPlayingId(note.id);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Voice Notes</h3>
        <div className="flex items-center gap-2">
          {recording && (
            <span className="text-sm text-red-400 font-mono" aria-live="polite">
              {formatDuration(elapsed)}
            </span>
          )}
          {recording ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              Stop
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={startRecording}
              disabled={uploading}
              aria-label="Start recording voice note"
            >
              {uploading ? "Uploading..." : "Record"}
            </Button>
          )}
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2 text-center">
          No voice notes yet. Tap Record to add one.
        </p>
      ) : (
        <ul className="space-y-2 list-none p-0" aria-label="Voice notes">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => togglePlay(note)}
                  aria-label={
                    playingId === note.id
                      ? "Pause voice note"
                      : "Play voice note"
                  }
                >
                  {playingId === note.id ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </Button>
                <span className="text-sm font-mono text-muted-foreground">
                  {formatDuration(note.duration)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString()}{" "}
                {new Date(note.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Live region for status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
    </div>
  );
}
