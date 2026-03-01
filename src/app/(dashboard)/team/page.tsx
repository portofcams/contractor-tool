"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface CrewMember {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: "lead" | "helper" | "subcontractor";
  hourlyRate: number;
  active: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  lead: "Lead",
  helper: "Helper",
  subcontractor: "Subcontractor",
};

const emptyForm: {
  name: string;
  phone: string;
  email: string;
  role: "lead" | "helper" | "subcontractor";
  hourlyRate: string;
} = {
  name: "",
  phone: "",
  email: "",
  role: "helper",
  hourlyRate: "",
};

export default function TeamPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CrewMember>>({});

  useEffect(() => {
    fetchCrew();
  }, []);

  async function fetchCrew() {
    try {
      const res = await fetch("/api/crew");
      if (res.ok) {
        const data = await res.json();
        setCrew(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function addMember() {
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone || undefined,
          email: form.email || undefined,
          role: form.role,
          hourlyRate: parseFloat(form.hourlyRate) || 0,
        }),
      });
      if (res.ok) {
        setForm(emptyForm);
        setDialogOpen(false);
        await fetchCrew();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(member: CrewMember) {
    try {
      const res = await fetch("/api/crew", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, active: !member.active }),
      });
      if (res.ok) {
        await fetchCrew();
      }
    } catch {
      // silently fail
    }
  }

  function startEditing(member: CrewMember) {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      phone: member.phone || "",
      email: member.email || "",
      role: member.role,
      hourlyRate: member.hourlyRate,
    });
  }

  async function saveEdit(memberId: string) {
    try {
      const res = await fetch("/api/crew", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberId, ...editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        await fetchCrew();
      }
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Team</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading crew...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Crew Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Crew Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      role: v as "lead" | "helper" | "subcontractor",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="helper">Helper</SelectItem>
                    <SelectItem value="subcontractor">
                      Subcontractor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="25.00"
                  value={form.hourlyRate}
                  onChange={(e) =>
                    setForm({ ...form, hourlyRate: e.target.value })
                  }
                  min="0"
                  step="0.50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={submitting || !form.name.trim()} onClick={addMember}>
                {submitting ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {crew.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No crew members yet.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Add Your First Crew Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {crew.map((member) => (
            <Card
              key={member.id}
              className={!member.active ? "opacity-60" : ""}
            >
              <CardContent className="py-4">
                {editingId === member.id ? (
                  /* Inline edit form */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input
                          value={editForm.email || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Role</Label>
                        <Select
                          value={editForm.role || "helper"}
                          onValueChange={(v) =>
                            setEditForm({
                              ...editForm,
                              role: v as "lead" | "helper" | "subcontractor",
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="helper">Helper</SelectItem>
                            <SelectItem value="subcontractor">
                              Subcontractor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Hourly Rate ($)</Label>
                        <Input
                          type="number"
                          value={editForm.hourlyRate || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              hourlyRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          min="0"
                          step="0.50"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(member.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display view */
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {ROLE_LABELS[member.role] || member.role}
                        </span>
                        {!member.active && (
                          <span className="text-xs text-destructive">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {member.phone && <span>{member.phone}</span>}
                        {member.email && <span>{member.email}</span>}
                        <span>${member.hourlyRate.toFixed(2)}/hr</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(member)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={member.active ? "outline" : "default"}
                        onClick={() => toggleActive(member)}
                      >
                        {member.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
