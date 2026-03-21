"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditorRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface OutputRoom {
  name: string;
  lengthFt: number;
  widthFt: number;
  sqft: number;
}

interface FloorplanEditorProps {
  onApply: (rooms: OutputRoom[]) => void;
}

const ROOM_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const GRID_SIZE = 20; // pixels
const INITIAL_SCALE = 2; // feet per grid cell

export function FloorplanEditor({ onApply }: FloorplanEditorProps) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<EditorRoom[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [dragging, setDragging] = useState<{
    type: "move" | "resize";
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (val: number) =>
    Math.round(val / GRID_SIZE) * GRID_SIZE;

  const pxToFeet = useCallback(
    (px: number) => Math.round((px / GRID_SIZE) * scale * 10) / 10,
    [scale]
  );

  function addRoom() {
    const id = crypto.randomUUID();
    const newRoom: EditorRoom = {
      id,
      name: `Room ${rooms.length + 1}`,
      x: 40 + rooms.length * 20,
      y: 40 + rooms.length * 20,
      width: GRID_SIZE * 6,
      height: GRID_SIZE * 5,
      color: ROOM_COLORS[rooms.length % ROOM_COLORS.length],
    };
    setRooms((prev) => [...prev, newRoom]);
    setSelectedId(id);
  }

  function deleteRoom(id: string) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handlePointerDown(
    e: React.PointerEvent,
    room: EditorRoom,
    type: "move" | "resize"
  ) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(room.id);
    setDragging({
      type,
      startX: e.clientX,
      startY: e.clientY,
      origX: room.x,
      origY: room.y,
      origW: room.width,
      origH: room.height,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !selectedId) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== selectedId) return r;
        if (dragging.type === "move") {
          return {
            ...r,
            x: snapToGrid(Math.max(0, dragging.origX + dx)),
            y: snapToGrid(Math.max(0, dragging.origY + dy)),
          };
        } else {
          return {
            ...r,
            width: snapToGrid(
              Math.max(GRID_SIZE * 2, dragging.origW + dx)
            ),
            height: snapToGrid(
              Math.max(GRID_SIZE * 2, dragging.origH + dy)
            ),
          };
        }
      })
    );
  }

  function handlePointerUp() {
    setDragging(null);
  }

  function startRenaming(room: EditorRoom) {
    setEditingName(room.id);
    setNameInput(room.name);
  }

  function finishRenaming() {
    if (editingName && nameInput.trim()) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingName ? { ...r, name: nameInput.trim() } : r
        )
      );
    }
    setEditingName(null);
    setNameInput("");
  }

  function applyLayout() {
    const outputRooms: OutputRoom[] = rooms.map((r) => {
      const lengthFt = pxToFeet(r.width);
      const widthFt = pxToFeet(r.height);
      return {
        name: r.name,
        lengthFt,
        widthFt,
        sqft: Math.round(lengthFt * widthFt),
      };
    });
    onApply(outputRooms);
    setOpen(false);
  }

  const totalSqft = rooms.reduce((sum, r) => {
    const l = pxToFeet(r.width);
    const w = pxToFeet(r.height);
    return sum + l * w;
  }, 0);

  // Draw grid
  useEffect(() => {
    // Canvas grid is handled via CSS background
  }, []);

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
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
        Draw Floor Plan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Floor Plan Editor</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" onClick={addRoom}>
                + Add Room
              </Button>
              {selectedId && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteRoom(selectedId)}
                >
                  Delete Room
                </Button>
              )}
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Label htmlFor="scale" className="text-xs">
                  Scale: 1 cell =
                </Label>
                <Input
                  id="scale"
                  type="number"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value) || 2)}
                  className="w-16 h-7 text-xs"
                />
                <span className="text-xs text-muted-foreground">ft</span>
              </div>
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="relative w-full h-[400px] bg-secondary/30 rounded-lg overflow-hidden border border-border cursor-crosshair select-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              }}
              onClick={() => setSelectedId(null)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {rooms.map((room) => {
                const lengthFt = pxToFeet(room.width);
                const widthFt = pxToFeet(room.height);
                const sqft = Math.round(lengthFt * widthFt);
                const isSelected = room.id === selectedId;

                return (
                  <div
                    key={room.id}
                    className={`absolute flex flex-col items-center justify-center transition-shadow ${
                      isSelected ? "ring-2 ring-white shadow-lg z-10" : "z-0"
                    }`}
                    style={{
                      left: room.x,
                      top: room.y,
                      width: room.width,
                      height: room.height,
                      backgroundColor: `${room.color}40`,
                      border: `2px solid ${room.color}`,
                      borderRadius: 4,
                    }}
                    onPointerDown={(e) => handlePointerDown(e, room, "move")}
                  >
                    {/* Room label */}
                    {editingName === room.id ? (
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={finishRenaming}
                        onKeyDown={(e) =>
                          e.key === "Enter" && finishRenaming()
                        }
                        className="bg-black/60 text-white text-xs px-1 rounded w-20 text-center"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="text-xs font-medium text-white bg-black/40 px-1.5 py-0.5 rounded cursor-text"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startRenaming(room);
                        }}
                      >
                        {room.name}
                      </span>
                    )}
                    <span className="text-[10px] text-white/80 mt-0.5">
                      {lengthFt}&apos; x {widthFt}&apos; ({sqft} sqft)
                    </span>

                    {/* Dimension labels on edges */}
                    <span
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground"
                    >
                      {lengthFt}&apos;
                    </span>
                    <span
                      className="absolute -right-6 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground rotate-90"
                    >
                      {widthFt}&apos;
                    </span>

                    {/* Resize handle */}
                    {isSelected && (
                      <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                        style={{ backgroundColor: room.color }}
                        onPointerDown={(e) =>
                          handlePointerDown(e, room, "resize")
                        }
                      />
                    )}
                  </div>
                );
              })}

              {rooms.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Click &quot;Add Room&quot; to start drawing
                  </p>
                </div>
              )}
            </div>

            {/* Room list */}
            {rooms.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {rooms.length} room{rooms.length !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">
                    Total: {Math.round(totalSqft)} sqft
                  </span>
                </div>
                <div className="space-y-1">
                  {rooms.map((room) => {
                    const l = pxToFeet(room.width);
                    const w = pxToFeet(room.height);
                    return (
                      <div
                        key={room.id}
                        className={`flex items-center justify-between text-sm p-2 rounded cursor-pointer transition-colors ${
                          room.id === selectedId
                            ? "bg-secondary"
                            : "hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedId(room.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: room.color }}
                          />
                          <span>{room.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {l}&apos; x {w}&apos; = {Math.round(l * w)} sqft
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apply */}
            {rooms.length > 0 && (
              <Button onClick={applyLayout} className="w-full">
                Use This Layout ({Math.round(totalSqft)} sqft)
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
