"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStats } from "@/components/project-stats";
import { ProjectTimeline } from "@/components/project-timeline";
import { TaskBoard } from "@/components/task-board";
import { DailyLogForm } from "@/components/daily-log-form";
import { ChangeOrderForm } from "@/components/change-order-form";
import { PhaseForm } from "@/components/phase-form";
import { SubManager } from "@/components/sub-manager";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "timeline", label: "Timeline" },
  { key: "tasks", label: "Tasks" },
  { key: "daily-log", label: "Daily Log" },
  { key: "change-orders", label: "Change Orders" },
  { key: "subs", label: "Subcontractors" },
  { key: "documents", label: "Documents" },
  { key: "budget", label: "Budget" },
];

const STATUS_OPTIONS = ["planning", "active", "on_hold", "completed", "cancelled"];
const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  planning: "secondary", active: "default", on_hold: "outline", completed: "default", cancelled: "destructive",
};
const PRIORITY_COLORS: Record<string, string> = { low: "text-gray-500", medium: "text-primary", high: "text-orange-500", urgent: "text-red-500" };

const CO_STATUS_COLORS: Record<string, string> = {
  proposed: "bg-purple-500/15 text-purple-500",
  approved: "bg-green-500/15 text-green-500",
  rejected: "bg-red-500/15 text-red-500",
  completed: "bg-primary/10 text-primary",
};

const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️", partly_cloudy: "⛅", cloudy: "☁️", rainy: "🌧️", stormy: "⛈️", snow: "❄️", windy: "💨", foggy: "🌫️",
};

const DOC_CATEGORIES = ["permit", "contract", "insurance", "plan", "photo", "invoice", "general"];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [budget, setBudget] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Form states
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showCOForm, setShowCOForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", phaseId: "", priority: "medium", assigneeType: "", crewMemberId: "", subcontractorId: "", dueDate: "", estimatedHours: "", estimatedCost: "" });
  const [docForm, setDocForm] = useState({ name: "", fileUrl: "", fileType: "general", category: "general", notes: "" });
  const [editingTask, setEditingTask] = useState<any>(null);

  // Filter states
  const [taskFilterPhase, setTaskFilterPhase] = useState("");
  const [taskFilterPriority, setTaskFilterPriority] = useState("");

  useEffect(() => { loadAll(); }, [id]);

  async function loadAll() {
    setLoading(true);
    const [projRes, statsRes] = await Promise.all([
      fetch(`/api/projects/${id}`),
      fetch(`/api/projects/${id}/stats`),
    ]);
    const proj = await projRes.json();
    setProject(proj);
    setStats(await statsRes.json());
    setEditForm({
      name: proj.name, description: proj.description || "", status: proj.status, priority: proj.priority,
      address: proj.address || "", startDate: proj.startDate?.split("T")[0] || "", estimatedEnd: proj.estimatedEnd?.split("T")[0] || "",
      budgetEstimated: proj.budgetEstimated?.toString() || "",
    });
    setLoading(false);
  }

  async function loadTimeline() {
    const res = await fetch(`/api/projects/${id}/timeline`);
    setTimeline(await res.json());
  }

  async function loadBudget() {
    const res = await fetch(`/api/projects/${id}/budget`);
    setBudget(await res.json());
  }

  useEffect(() => {
    if (tab === "timeline" && !timeline) loadTimeline();
    if (tab === "budget" && !budget) loadBudget();
  }, [tab]);

  async function saveEdit() {
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditing(false);
    loadAll();
  }

  async function handleTaskStatusChange(taskId: string, status: string) {
    await fetch(`/api/projects/${id}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAll();
  }

  async function saveTask(e: React.FormEvent) {
    e.preventDefault();
    const url = editingTask ? `/api/projects/${id}/tasks/${editingTask.id}` : `/api/projects/${id}/tasks`;
    await fetch(url, {
      method: editingTask ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskForm),
    });
    setShowTaskForm(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "", phaseId: "", priority: "medium", assigneeType: "", crewMemberId: "", subcontractorId: "", dueDate: "", estimatedHours: "", estimatedCost: "" });
    loadAll();
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/projects/${id}/tasks/${taskId}`, { method: "DELETE" });
    loadAll();
  }

  async function saveDoc(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/projects/${id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docForm),
    });
    setShowDocForm(false);
    setDocForm({ name: "", fileUrl: "", fileType: "general", category: "general", notes: "" });
    loadAll();
  }

  async function deleteDoc(docId: string) {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/projects/${id}/documents/${docId}`, { method: "DELETE" });
    loadAll();
  }

  async function updateCOStatus(orderId: string, status: string) {
    await fetch(`/api/projects/${id}/change-orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAll();
    loadBudget();
  }

  async function deletePhase(phaseId: string) {
    if (!confirm("Delete this phase and all its tasks?")) return;
    await fetch(`/api/projects/${id}/phases/${phaseId}`, { method: "DELETE" });
    loadAll();
    loadTimeline();
  }

  async function deleteProject() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.push("/projects");
  }

  if (loading || !project) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="text-2xl font-bold w-full px-2 py-1 rounded border border-border bg-background" />
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded border border-border bg-background text-sm" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-3 py-2 rounded border border-border bg-background text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
                <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="px-3 py-2 rounded border border-border bg-background text-sm">
                  {["low", "medium", "high", "urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className="px-3 py-2 rounded border border-border bg-background text-sm" />
                <input type="date" value={editForm.estimatedEnd} onChange={(e) => setEditForm({ ...editForm, estimatedEnd: e.target.value })} className="px-3 py-2 rounded border border-border bg-background text-sm" />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Badge variant={STATUS_BADGE[project.status]}>{project.status.replace("_", " ")}</Badge>
                <span className={`text-sm font-medium ${PRIORITY_COLORS[project.priority]}`}>{project.priority}</span>
              </div>
              {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                {project.customer && <span>Client: {project.customer.name}</span>}
                {project.address && <span>{project.address}</span>}
                {project.startDate && <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>}
                {project.estimatedEnd && <span>End: {new Date(project.estimatedEnd).toLocaleDateString()}</span>}
              </div>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={deleteProject}>Delete</Button>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && <ProjectStats stats={stats} />}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { setTab("tasks"); setShowTaskForm(true); }}>+ Add Task</Button>
            <Button variant="outline" onClick={() => { setTab("daily-log"); setShowLogForm(true); }}>+ Log Day</Button>
            <Button variant="outline" onClick={() => { setTab("change-orders"); setShowCOForm(true); }}>+ Change Order</Button>
            <Button variant="outline" onClick={() => { setTab("timeline"); setShowPhaseForm(true); }}>+ Add Phase</Button>
          </div>

          {/* Recent activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {project.dailyLogs.length === 0 && project.changeOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {project.dailyLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <span className="text-lg">{WEATHER_ICONS[log.weather] || "📋"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{new Date(log.date).toLocaleDateString()}</p>
                        {log.workCompleted && <p className="text-xs text-muted-foreground line-clamp-2">{log.workCompleted}</p>}
                        {log.delayReason && <Badge variant="outline" className="mt-1 text-yellow-500">{log.delayReason} — {log.delayHours}h delay</Badge>}
                      </div>
                    </div>
                  ))}
                  {project.changeOrders.filter((co: any) => co.status === "proposed").map((co: any) => (
                    <div key={co.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <div>
                        <p className="text-sm font-medium">CO #{co.orderNumber}: {co.title}</p>
                        <p className="text-xs text-muted-foreground">{co.costImpact >= 0 ? "+" : ""}${co.costImpact.toLocaleString()} · {co.daysImpact}d impact</p>
                      </div>
                      <Badge className="bg-purple-500/15 text-purple-500">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phases summary */}
          {project.phases.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Phases</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.phases.map((phase: any) => {
                    const done = phase.tasks.filter((t: any) => t.status === "done").length;
                    const total = phase.tasks.length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={phase.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: phase.color || "#6b7280" }} />
                        <span className="text-sm font-medium flex-1">{phase.name}</span>
                        <span className="text-xs text-muted-foreground">{done}/{total} tasks</span>
                        <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <Badge variant={phase.status === "completed" ? "default" : phase.status === "in_progress" ? "secondary" : "outline"} className="text-[10px]">
                          {phase.status.replace("_", " ")}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === "timeline" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Project Timeline</h2>
            <Button onClick={() => setShowPhaseForm(true)}>+ Add Phase</Button>
          </div>
          {showPhaseForm && (
            <Card><CardContent className="pt-6">
              <PhaseForm projectId={id} existingPhases={project.phases.map((p: any) => ({ id: p.id, name: p.name }))} onSaved={() => { setShowPhaseForm(false); loadAll(); loadTimeline(); }} onCancel={() => setShowPhaseForm(false)} />
            </CardContent></Card>
          )}
          {timeline ? (
            <Card><CardContent className="pt-6 overflow-x-auto">
              <ProjectTimeline data={timeline} />
            </CardContent></Card>
          ) : (
            <div className="h-48 bg-secondary rounded-lg animate-pulse" />
          )}
          {/* Phase list with actions */}
          {project.phases.length > 0 && (
            <div className="space-y-2">
              {project.phases.map((phase: any) => (
                <Card key={phase.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color || "#6b7280" }} />
                        <span className="font-medium">{phase.name}</span>
                        {phase.dependsOn && <span className="text-xs text-muted-foreground">depends on: {phase.dependsOn.name}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={phase.status}
                          onChange={async (e) => {
                            await fetch(`/api/projects/${id}/phases/${phase.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) });
                            loadAll(); loadTimeline();
                          }}
                          className="text-xs px-2 py-1 rounded border border-border bg-background"
                        >
                          {["not_started", "in_progress", "completed", "blocked", "skipped"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                        <Button size="sm" variant="ghost" className="text-red-500 h-7" onClick={() => deletePhase(phase.id)}>Delete</Button>
                      </div>
                    </div>
                    {phase.description && <p className="text-xs text-muted-foreground mt-1">{phase.description}</p>}
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      {phase.startDate && <span>Start: {new Date(phase.startDate).toLocaleDateString()}</span>}
                      {phase.endDate && <span>End: {new Date(phase.endDate).toLocaleDateString()}</span>}
                      {phase.budgetEstimated && <span>Budget: ${phase.budgetEstimated.toLocaleString()}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex gap-2">
              <select value={taskFilterPhase} onChange={(e) => setTaskFilterPhase(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
                <option value="">All phases</option>
                {project.phases.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={taskFilterPriority} onChange={(e) => setTaskFilterPriority(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
                <option value="">All priorities</option>
                {["low", "medium", "high", "urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <Button onClick={() => { setEditingTask(null); setTaskForm({ title: "", description: "", phaseId: project.phases[0]?.id || "", priority: "medium", assigneeType: "", crewMemberId: "", subcontractorId: "", dueDate: "", estimatedHours: "", estimatedCost: "" }); setShowTaskForm(true); }}>+ Add Task</Button>
          </div>

          {showTaskForm && (
            <Card><CardContent className="pt-6">
              <form onSubmit={saveTask} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Title *</label>
                    <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phase</label>
                    <select value={taskForm.phaseId} onChange={(e) => setTaskForm({ ...taskForm, phaseId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
                      <option value="">No phase</option>
                      {project.phases.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
                      {["low", "medium", "high", "urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Hours</label>
                    <input type="number" step="0.5" value={taskForm.estimatedHours} onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Cost ($)</label>
                    <input type="number" step="0.01" value={taskForm.estimatedCost} onChange={(e) => setTaskForm({ ...taskForm, estimatedCost: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingTask ? "Update" : "Add"} Task</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowTaskForm(false); setEditingTask(null); }}>Cancel</Button>
                  {editingTask && <Button type="button" variant="destructive" size="sm" onClick={() => { deleteTask(editingTask.id); setShowTaskForm(false); setEditingTask(null); }}>Delete</Button>}
                </div>
              </form>
            </CardContent></Card>
          )}

          <TaskBoard
            tasks={project.tasks}
            onStatusChange={handleTaskStatusChange}
            onTaskClick={(task) => {
              setEditingTask(task);
              setTaskForm({
                title: task.title, description: task.description || "", phaseId: task.phase?.id || "",
                priority: task.priority, assigneeType: "", crewMemberId: task.crewMember?.id || "",
                subcontractorId: task.subcontractor?.id || "", dueDate: task.dueDate?.split("T")[0] || "",
                estimatedHours: task.estimatedHours?.toString() || "", estimatedCost: task.estimatedCost?.toString() || "",
              });
              setShowTaskForm(true);
            }}
            filterPhase={taskFilterPhase}
            filterPriority={taskFilterPriority}
          />
        </div>
      )}

      {tab === "daily-log" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daily Logs</h2>
            <Button onClick={() => setShowLogForm(true)}>+ New Log Entry</Button>
          </div>
          {showLogForm && (
            <Card><CardContent className="pt-6">
              <DailyLogForm projectId={id} onSaved={() => { setShowLogForm(false); loadAll(); }} onCancel={() => setShowLogForm(false)} />
            </CardContent></Card>
          )}
          {project.dailyLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No daily logs yet</p>
          ) : (
            <div className="space-y-3">
              {project.dailyLogs.map((log: any) => {
                const crew = log.crewOnSite as { name: string; role: string; hoursWorked: number }[] | null;
                return (
                  <Card key={log.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{WEATHER_ICONS[log.weather] || "📋"}</span>
                          <div>
                            <p className="font-medium">{new Date(log.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {log.temperature && <span>{log.temperature}°F</span>}
                              {crew && <span>{crew.length} crew on site</span>}
                            </div>
                          </div>
                        </div>
                        {log.delayReason && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">{log.delayReason} — {log.delayHours}h</Badge>
                        )}
                      </div>
                      {log.workCompleted && <p className="text-sm mt-3">{log.workCompleted}</p>}
                      {log.issues && <p className="text-sm mt-2 text-red-400">Issues: {log.issues}</p>}
                      {crew && crew.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Crew</p>
                          <div className="flex flex-wrap gap-2">
                            {crew.map((c, i) => (
                              <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{c.name} ({c.role}) — {c.hoursWorked}h</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {log.safetyNotes && <p className="text-xs mt-2 text-muted-foreground">Safety: {log.safetyNotes}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "change-orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Change Orders</h2>
              {project.changeOrders.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Approved total: <span className={project.changeOrders.filter((co: any) => co.status === "approved").reduce((s: number, co: any) => s + co.costImpact, 0) >= 0 ? "text-red-500" : "text-green-500"}>
                    ${project.changeOrders.filter((co: any) => co.status === "approved").reduce((s: number, co: any) => s + co.costImpact, 0).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
            <Button onClick={() => setShowCOForm(true)}>+ New Change Order</Button>
          </div>
          {showCOForm && (
            <Card><CardContent className="pt-6">
              <ChangeOrderForm projectId={id} onSaved={() => { setShowCOForm(false); loadAll(); }} onCancel={() => setShowCOForm(false)} />
            </CardContent></Card>
          )}
          {project.changeOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No change orders</p>
          ) : (
            <div className="space-y-2">
              {project.changeOrders.map((co: any) => (
                <Card key={co.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-muted-foreground">CO #{co.orderNumber}</span>
                          <span className="font-medium">{co.title}</span>
                          <Badge className={CO_STATUS_COLORS[co.status]}>{co.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{co.description}</p>
                        <div className="flex gap-3 mt-1 text-xs">
                          <span className={co.costImpact >= 0 ? "text-red-500" : "text-green-500"}>
                            {co.costImpact >= 0 ? "+" : ""}${co.costImpact.toLocaleString()}
                          </span>
                          {co.daysImpact !== 0 && <span className="text-muted-foreground">{co.daysImpact > 0 ? "+" : ""}{co.daysImpact} days</span>}
                          {co.reason && <span className="text-muted-foreground">{co.reason.replace("_", " ")}</span>}
                        </div>
                      </div>
                      {co.status === "proposed" && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => updateCOStatus(co.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => updateCOStatus(co.id, "rejected")}>Reject</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "subs" && (
        <SubManager
          projectId={id}
          phases={project.phases.map((p: any) => ({ id: p.id, name: p.name }))}
        />
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Documents</h2>
            <Button onClick={() => setShowDocForm(true)}>+ Add Document</Button>
          </div>
          {showDocForm && (
            <Card><CardContent className="pt-6">
              <form onSubmit={saveDoc} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <input value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select value={docForm.category} onChange={(e) => setDocForm({ ...docForm, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
                      {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">File URL *</label>
                    <input value={docForm.fileUrl} onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Notes</label>
                    <input value={docForm.notes} onChange={(e) => setDocForm({ ...docForm, notes: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Document</Button>
                  <Button type="button" variant="outline" onClick={() => setShowDocForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent></Card>
          )}
          {project.documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No documents yet</p>
          ) : (
            <div className="space-y-2">
              {DOC_CATEGORIES.map((cat) => {
                const docs = project.documents.filter((d: any) => d.category === cat);
                if (docs.length === 0) return null;
                return (
                  <Card key={cat}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">{cat.charAt(0).toUpperCase() + cat.slice(1)}s</CardTitle></CardHeader>
                    <CardContent>
                      {docs.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">{doc.name}</a>
                            {doc.notes && <p className="text-xs text-muted-foreground">{doc.notes}</p>}
                          </div>
                          <Button size="sm" variant="ghost" className="text-red-500 h-7" onClick={() => deleteDoc(doc.id)}>Remove</Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "budget" && (
        <div className="space-y-4">
          {budget ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card><CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground">Original Budget</p>
                  <p className="text-xl font-bold">${budget.originalBudget.toLocaleString()}</p>
                </CardContent></Card>
                <Card><CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground">Change Orders</p>
                  <p className={`text-xl font-bold ${budget.changeOrdersApproved >= 0 ? "text-red-500" : "text-green-500"}`}>
                    {budget.changeOrdersApproved >= 0 ? "+" : ""}${budget.changeOrdersApproved.toLocaleString()}
                  </p>
                </CardContent></Card>
                <Card><CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground">Adjusted Budget</p>
                  <p className="text-xl font-bold">${budget.adjustedBudget.toLocaleString()}</p>
                </CardContent></Card>
                <Card><CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className={`text-xl font-bold ${budget.health === "over" ? "text-red-500" : ""}`}>${budget.totalSpent.toLocaleString()}</p>
                </CardContent></Card>
                <Card className={budget.remaining < 0 ? "border-red-500/30" : ""}><CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className={`text-xl font-bold ${budget.remaining < 0 ? "text-red-500" : "text-green-500"}`}>${budget.remaining.toLocaleString()}</p>
                </CardContent></Card>
              </div>

              {/* Budget bar */}
              <Card><CardContent className="pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Budget Usage: {budget.percentUsed}%</span>
                  <span className={budget.health === "over" ? "text-red-500" : budget.health === "warning" ? "text-yellow-500" : "text-green-500"}>
                    {budget.health === "over" ? "Over Budget" : budget.health === "warning" ? "Near Limit" : "On Track"}
                  </span>
                </div>
                <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${budget.health === "over" ? "bg-red-500" : budget.health === "warning" ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(budget.percentUsed, 100)}%` }} />
                </div>
              </CardContent></Card>

              {/* Phase breakdown */}
              {budget.phases.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Phase Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-2">Phase</th>
                          <th className="text-right py-2">Estimated</th>
                          <th className="text-right py-2">Actual</th>
                          <th className="text-right py-2">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budget.phases.map((p: any) => (
                          <tr key={p.id} className="border-b border-border/50">
                            <td className="py-2">{p.name}</td>
                            <td className="text-right py-2">${p.estimated.toLocaleString()}</td>
                            <td className="text-right py-2">${p.actual.toLocaleString()}</td>
                            <td className={`text-right py-2 ${p.variance < 0 ? "text-red-500" : "text-green-500"}`}>
                              {p.variance >= 0 ? "+" : ""}${p.variance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              {/* Pending change orders impact */}
              {budget.changeOrdersPending !== 0 && (
                <Card className="border-yellow-500/30">
                  <CardContent className="pt-6">
                    <p className="text-sm text-yellow-500">
                      Pending change orders: {budget.changeOrdersPending >= 0 ? "+" : ""}${budget.changeOrdersPending.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="h-48 bg-secondary rounded-lg animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
