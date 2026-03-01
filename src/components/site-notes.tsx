"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SiteNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function SiteNotes({
  notes: initialNotes,
  customerId,
  quoteId,
}: {
  notes: SiteNote[];
  customerId?: string;
  quoteId?: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const newNoteRef = useRef<HTMLTextAreaElement>(null);

  async function addNote() {
    if (!newNote.trim()) return;
    setSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/site-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          quoteId,
          content: newNote,
        }),
      });

      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setNewNote("");
        setStatusMessage("Note added.");
        newNoteRef.current?.focus();
      } else {
        setStatusMessage("Failed to add note.");
      }
    } catch {
      setStatusMessage("Failed to add note.");
    }
    setSaving(false);
  }

  async function updateNote(id: string) {
    if (!editContent.trim()) return;
    setStatusMessage("");

    try {
      const res = await fetch("/api/site-notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: editContent }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        setEditingId(null);
        setStatusMessage("Note updated.");
      } else {
        setStatusMessage("Failed to update note.");
      }
    } catch {
      setStatusMessage("Failed to update note.");
    }
  }

  async function deleteNote(id: string) {
    setStatusMessage("");

    try {
      const res = await fetch("/api/site-notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        setStatusMessage("Note deleted.");
      } else {
        setStatusMessage("Failed to delete note.");
      }
    } catch {
      setStatusMessage("Failed to delete note.");
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Site Notes</h3>

      {/* Add note */}
      <div className="flex gap-2">
        <textarea
          ref={newNoteRef}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about the job site..."
          aria-label="New site note (press Ctrl+Enter to submit)"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote();
          }}
        />
        <Button
          size="sm"
          onClick={addNote}
          disabled={!newNote.trim() || saving}
          aria-label="Add site note"
          className="self-end"
        >
          {saving ? "..." : "Add"}
        </Button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2 text-center">
          No notes yet. Add observations from your site visit.
        </p>
      ) : (
        <ul className="space-y-2 list-none p-0" aria-label="Site notes">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border border-border rounded-lg p-3 space-y-1"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    aria-label="Edit note content"
                    autoFocus
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => updateNote(note.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}{" "}
                      {new Date(note.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                        aria-label={`Edit note: ${note.content.slice(0, 40)}`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </button>
                      <span className="text-xs text-muted-foreground" aria-hidden="true">&middot;</span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        aria-label={`Delete note: ${note.content.slice(0, 40)}`}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
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
