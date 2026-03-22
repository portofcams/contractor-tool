"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Plus, Trash2 } from "lucide-react";

interface TimeEntry {
  id: string;
  jobId: string | null;
  crewMemberId: string | null;
  date: string;
  clockIn: string;
  clockOut: string | null;
  hours: number | null;
  hourlyRate: number | null;
  description: string | null;
  billable: boolean;
  job?: { id: string; quote: { projectName: string | null } } | null;
  crewMember?: { id: string; name: string } | null;
}

interface Job {
  id: string;
  quote: { projectName: string | null };
}

interface CrewMember {
  id: string;
  name: string;
  hourlyRate: number | null;
}

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formJobId, setFormJobId] = useState("");
  const [formCrewId, setFormCrewId] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formHours, setFormHours] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Tick the active timer
  useEffect(() => {
    if (!activeTimer) return;
    const interval = setInterval(() => {
      const diff = Date.now() - new Date(activeTimer.clockIn).getTime();
      setElapsed(Math.floor(diff / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  async function loadData() {
    setLoading(true);
    const [entriesRes, jobsRes, crewRes] = await Promise.all([
      fetch("/api/time-entries"),
      fetch("/api/jobs"),
      fetch("/api/crew"),
    ]);
    const entriesData = await entriesRes.json();
    const jobsData = await jobsRes.json();
    const crewData = await crewRes.json();

    if (Array.isArray(entriesData)) {
      setEntries(entriesData);
      const running = entriesData.find((e: TimeEntry) => !e.clockOut);
      if (running) setActiveTimer(running);
    }
    if (Array.isArray(jobsData)) setJobs(jobsData);
    if (Array.isArray(crewData)) setCrew(crewData);
    setLoading(false);
  }

  async function clockIn() {
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clockIn: new Date().toISOString(),
        jobId: formJobId || undefined,
        crewMemberId: formCrewId || undefined,
        description: formDesc || undefined,
      }),
    });
    if (res.ok) {
      const entry = await res.json();
      setActiveTimer(entry);
      setEntries((prev) => [entry, ...prev]);
      setShowForm(false);
      setFormJobId("");
      setFormCrewId("");
      setFormDesc("");
    }
  }

  async function clockOut() {
    if (!activeTimer) return;
    const res = await fetch("/api/time-entries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activeTimer.id,
        clockOut: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setActiveTimer(null);
      setElapsed(0);
    }
  }

  async function addManualEntry() {
    const hours = parseFloat(formHours);
    if (!hours || hours <= 0) return;

    const now = new Date();
    const clockIn = new Date(now.getTime() - hours * 3600 * 1000);

    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clockIn: clockIn.toISOString(),
        clockOut: now.toISOString(),
        hours,
        jobId: formJobId || undefined,
        crewMemberId: formCrewId || undefined,
        description: formDesc || undefined,
      }),
    });
    if (res.ok) {
      await loadData();
      setShowForm(false);
      setFormHours("");
      setFormJobId("");
      setFormCrewId("");
      setFormDesc("");
    }
  }

  async function deleteEntry(id: string) {
    await fetch(`/api/time-entries?id=${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (activeTimer?.id === id) {
      setActiveTimer(null);
      setElapsed(0);
    }
  }

  function formatElapsed(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Calculate totals
  const todayEntries = entries.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString()
  );
  const todayHours = todayEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEntries = entries.filter((e) => new Date(e.date) >= weekStart);
  const weekHours = weekEntries.reduce((sum, e) => sum + (e.hours || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        {!activeTimer && !showForm && (
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Manual
            </Button>
            <Button onClick={clockIn} size="sm">
              <Play className="mr-1.5 h-4 w-4" />
              Clock In
            </Button>
          </div>
        )}
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Clocked In</span>
                </div>
                <p className="mt-2 font-mono text-4xl font-bold">{formatElapsed(elapsed)}</p>
                {activeTimer.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{activeTimer.description}</p>
                )}
                {activeTimer.job?.quote?.projectName && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Job: {activeTimer.job.quote.projectName}
                  </p>
                )}
              </div>
              <Button onClick={clockOut} variant="destructive" size="lg">
                <Square className="mr-2 h-4 w-4" />
                Clock Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick entry form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Time Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Job</label>
                <select
                  value={formJobId}
                  onChange={(e) => setFormJobId(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">No job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.quote?.projectName || "Untitled Job"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Crew Member</label>
                <select
                  value={formCrewId}
                  onChange={(e) => setFormCrewId(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Myself</option>
                  {crew.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <input
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="What did you work on?"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hours (manual entry)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={formHours}
                onChange={(e) => setFormHours(e.target.value)}
                placeholder="e.g. 4.5"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addManualEntry} disabled={!formHours}>
                Add Entry
              </Button>
              <Button onClick={() => { clockIn(); }} variant="outline">
                <Play className="mr-1.5 h-4 w-4" />
                Start Timer Instead
              </Button>
              <Button onClick={() => setShowForm(false)} variant="ghost">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{todayHours.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Hours Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{weekHours.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Hours This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{entries.length}</p>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Entry list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No time entries yet. Clock in to start tracking.
            </p>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(entry.clockIn)}
                        {entry.clockOut && ` — ${formatTime(entry.clockOut)}`}
                      </span>
                      {!entry.clockOut && (
                        <Badge variant="outline" className="text-green-600 border-green-500/50">
                          Running
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {entry.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {entry.description}
                        </span>
                      )}
                      {entry.job?.quote?.projectName && (
                        <Badge variant="secondary" className="text-xs">
                          {entry.job.quote.projectName}
                        </Badge>
                      )}
                      {entry.crewMember && (
                        <Badge variant="outline" className="text-xs">
                          {entry.crewMember.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {entry.hours && (
                      <span className="text-sm font-bold">{entry.hours.toFixed(1)}h</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
