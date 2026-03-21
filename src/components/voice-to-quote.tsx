"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MaterialLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  cost: number;
}

interface Room {
  name: string;
  lengthFt: number;
  widthFt: number;
  heightFt?: number;
  sqft: number;
}

interface VoiceParseResult {
  rooms: Room[];
  materials: MaterialLine[];
  notes: string;
  confidence: "high" | "medium" | "low";
}

interface VoiceToQuoteProps {
  trade: string;
  onApply: (materials: MaterialLine[], rooms: Room[]) => void;
}

export function VoiceToQuote({ trade, onApply }: VoiceToQuoteProps) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<VoiceParseResult | null>(null);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const [inputMode, setInputMode] = useState<"voice" | "type">("voice");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      setInputMode("type");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimTranscript("");
  }, []);

  function startListening() {
    setError("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + " ";
        } else {
          interim += t;
        }
      }
      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone access.");
      } else if (event.error !== "aborted") {
        setError(`Speech error: ${event.error}`);
      }
      stopListening();
    };

    recognition.onend = () => {
      // Auto-restart if still in listening mode (browser stops after silence)
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  async function processTranscript() {
    if (!transcript.trim()) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/quotes/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript.trim(), trade }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Processing failed");
        setProcessing(false);
        return;
      }

      const data: VoiceParseResult = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setProcessing(false);
  }

  function applyResult() {
    if (!result) return;
    onApply(result.materials, result.rooms);
    setOpen(false);
    setResult(null);
    setTranscript("");
    setInterimTranscript("");
  }

  function reset() {
    stopListening();
    setTranscript("");
    setInterimTranscript("");
    setResult(null);
    setError("");
  }

  const confidenceColor =
    result?.confidence === "high"
      ? "text-green-400"
      : result?.confidence === "medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
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
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
        Voice-to-Quote
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) stopListening();
          setOpen(v);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voice-to-Quote</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Describe the rooms and materials — speak or type your notes.
          </p>

          {/* Mode toggle: Voice vs Type */}
          <div className="flex gap-2">
            <button
              onClick={() => setInputMode("voice")}
              className={`flex-1 text-sm py-2 px-3 rounded-md border transition-colors ${
                inputMode === "voice"
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Voice
            </button>
            <button
              onClick={() => setInputMode("type")}
              className={`flex-1 text-sm py-2 px-3 rounded-md border transition-colors ${
                inputMode === "type"
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Type / Paste Notes
            </button>
          </div>

          <div className="space-y-4">
            {inputMode === "voice" ? (
              <>
                {/* Mic button */}
                <div className="flex justify-center">
                  <button
                    onClick={listening ? stopListening : startListening}
                    disabled={processing}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      listening
                        ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/30"
                        : "bg-primary hover:bg-primary shadow-lg shadow-primary/20"
                    }`}
                    aria-label={listening ? "Stop listening" : "Start listening"}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {listening ? (
                        <rect x="6" y="6" width="12" height="12" rx="1" />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                      )}
                    </svg>
                  </button>
                </div>

                {listening && (
                  <p className="text-center text-sm text-red-400 animate-pulse">
                    Listening...
                  </p>
                )}
              </>
            ) : (
              /* Text input mode */
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="e.g. Living room 15 by 20, oak hardwood. Kitchen 12 by 14, vinyl plank. Hallway about 40 sqft, same material."
                className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}

            {/* Transcript */}
            {(transcript || interimTranscript) && (
              <div className="bg-secondary/50 rounded-lg p-3 min-h-[80px] max-h-[200px] overflow-y-auto">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Transcript
                </p>
                <p className="text-sm">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-muted-foreground italic">
                      {interimTranscript}
                    </span>
                  )}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Action buttons */}
            {transcript && !result && (
              <div className="flex gap-3">
                <Button
                  onClick={processTranscript}
                  disabled={processing || listening}
                  className="flex-1"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          fill="currentColor"
                          className="opacity-75"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Process with AI"
                  )}
                </Button>
                <Button variant="outline" onClick={reset}>
                  Clear
                </Button>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className={`font-medium capitalize ${confidenceColor}`}>
                    {result.confidence}
                  </span>
                </div>

                {result.rooms.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Detected Rooms
                    </p>
                    <div className="space-y-1">
                      {result.rooms.map((room, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm bg-secondary/50 p-2 rounded"
                        >
                          <span>{room.name}</span>
                          <span className="text-muted-foreground">
                            {room.lengthFt}&apos; x {room.widthFt}&apos; ={" "}
                            {room.sqft} sqft
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Estimated Materials
                  </p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left p-2 font-medium text-xs">
                            Item
                          </th>
                          <th className="text-right p-2 font-medium text-xs">
                            Qty
                          </th>
                          <th className="text-right p-2 font-medium text-xs">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.materials.map((m, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="p-2">{m.item}</td>
                            <td className="text-right p-2 text-muted-foreground">
                              {m.qty} {m.unit}
                            </td>
                            <td className="text-right p-2">
                              ${m.cost.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-primary/30">
                          <td className="p-2 font-bold" colSpan={2}>
                            Total
                          </td>
                          <td className="text-right p-2 font-bold text-primary">
                            $
                            {result.materials
                              .reduce((s, m) => s + m.cost, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {result.notes && (
                  <div className="bg-primary/8 text-blue-300 text-xs p-3 rounded-md">
                    <span className="font-medium">AI Notes:</span>{" "}
                    {result.notes}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={applyResult} className="flex-1">
                    Use This Estimate
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
