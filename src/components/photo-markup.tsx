"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

type Tool = "draw" | "arrow" | "circle" | "text";
type Color = "#ef4444" | "#3b82f6" | "#eab308" | "#ffffff";

const COLORS: { value: Color; label: string }[] = [
  { value: "#ef4444", label: "Red" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#eab308", label: "Yellow" },
  { value: "#ffffff", label: "White" },
];

interface PhotoMarkupProps {
  imageUrl: string;
  photoId: string;
  customerId?: string;
  quoteId?: string;
  onSave: (newPhotoUrl: string, newPhotoId: string) => void;
  onClose: () => void;
}

export function PhotoMarkup({
  imageUrl,
  photoId,
  customerId,
  quoteId,
  onSave,
  onClose,
}: PhotoMarkupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [tool, setTool] = useState<Tool>("draw");
  const [color, setColor] = useState<Color>("#ef4444");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // History for undo
  const historyRef = useRef<ImageData[]>([]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const img = imgRef.current;
    if (!canvas || !overlay || !img) return;

    // Size canvas to fit container while maintaining aspect ratio
    const container = containerRef.current;
    if (!container) return;
    const maxW = container.clientWidth;
    const maxH = container.clientHeight - 60; // room for toolbar
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);

    canvas.width = w;
    canvas.height = h;
    overlay.width = w;
    overlay.height = h;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, w, h);
      // Save initial state
      historyRef.current = [ctx.getImageData(0, 0, w, h)];
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      initCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl, initCanvas]);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function saveState() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 30) historyRef.current.shift();
  }

  function undo() {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    historyRef.current.pop();
    const prev = historyRef.current[historyRef.current.length - 1];
    ctx.putImageData(prev, 0, 0);
  }

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const pos = getPos(e);

    if (tool === "text") {
      setTextPos(pos);
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);

    if (tool === "draw") {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);

    if (tool === "draw") {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    } else if (tool === "arrow" || tool === "circle") {
      // Draw preview on overlay
      const overlay = overlayRef.current;
      const ctx = overlay?.getContext("2d");
      if (ctx && overlay && startPos) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        if (tool === "arrow") {
          drawArrow(ctx, startPos.x, startPos.y, pos.x, pos.y);
        } else {
          const rx = Math.abs(pos.x - startPos.x) / 2;
          const ry = Math.abs(pos.y - startPos.y) / 2;
          const cx = (pos.x + startPos.x) / 2;
          const cy = (pos.y + startPos.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }

  function handleEnd(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);

    if (tool === "draw") {
      saveState();
    } else if ((tool === "arrow" || tool === "circle") && startPos) {
      const pos = getPos(e);
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      const ctx = canvas?.getContext("2d");
      const overlayCtx = overlay?.getContext("2d");

      if (ctx && overlayCtx && overlay) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        if (tool === "arrow") {
          drawArrow(ctx, startPos.x, startPos.y, pos.x, pos.y);
        } else {
          const rx = Math.abs(pos.x - startPos.x) / 2;
          const ry = Math.abs(pos.y - startPos.y) / 2;
          const cx = (pos.x + startPos.x) / 2;
          const cy = (pos.y + startPos.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        saveState();
      }
    }
    setStartPos(null);
  }

  function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    const headLen = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  function addText() {
    if (!textInput || !textPos) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeText(textInput, textPos.x, textPos.y);
    ctx.fillText(textInput, textPos.x, textPos.y);
    saveState();
    setTextInput("");
    setTextPos(null);
  }

  async function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      if (!blob) throw new Error("Failed to create image");

      const formData = new FormData();
      formData.append("file", blob, `markup-${photoId}.jpg`);
      if (customerId) formData.append("customerId", customerId);
      if (quoteId) formData.append("quoteId", quoteId);
      formData.append("caption", "Annotated photo");
      formData.append("photoType", "general");

      const res = await fetch("/api/site-photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const photo = await res.json();
        onSave(photo.fileUrl, photo.id);
      }
    } catch (err) {
      console.error("Save markup error:", err);
    }
    setSaving(false);
  }

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: "draw", label: "Draw", icon: "M" },
    { id: "arrow", label: "Arrow", icon: "→" },
    { id: "circle", label: "Circle", icon: "○" },
    { id: "text", label: "Text", icon: "T" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-border">
        <div className="flex items-center gap-2">
          {/* Tools */}
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                tool === t.id
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          {/* Colors */}
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-7 h-7 rounded-full border-2 transition-colors ${
                color === c.value ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          <Button size="sm" variant="ghost" onClick={undo} className="text-xs">
            Undo
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Markup"}
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden p-4"
      >
        {!loaded && (
          <p className="text-muted-foreground">Loading image...</p>
        )}
        <div className="relative" style={{ display: loaded ? "block" : "none" }}>
          <canvas
            ref={canvasRef}
            className="rounded-lg cursor-crosshair touch-none"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
          <canvas
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none rounded-lg"
          />
          {/* Text input popup */}
          {textPos && (
            <div
              className="absolute bg-[#1e293b] border border-border rounded-lg p-2 shadow-lg flex gap-2"
              style={{ left: textPos.x, top: textPos.y + 5 }}
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type text..."
                className="bg-secondary text-sm px-2 py-1 rounded border border-border w-40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") addText();
                  if (e.key === "Escape") setTextPos(null);
                }}
              />
              <Button size="sm" onClick={addText} disabled={!textInput}>
                Add
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
