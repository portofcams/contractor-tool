"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: string | null;
  estimatedEnd: string | null;
  budgetEstimated: number | null;
  budgetActual: number;
  customer: { id: string; name: string } | null;
  _counts: { phases: number; tasksTotal: number; tasksDone: number };
  _changeOrderTotal: number;
}

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "planning", label: "Planning" },
  { key: "active", label: "Active" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
];

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  planning: "secondary",
  active: "default",
  on_hold: "outline",
  completed: "default",
  cancelled: "destructive",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-primary",
  high: "text-orange-500",
  urgent: "text-red-500",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");

  useEffect(() => {
    loadProjects();
  }, [statusFilter, search, sort]);

  async function loadProjects() {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);
    params.set("sort", sort);
    const res = await fetch(`/api/projects?${params}`);
    setProjects(await res.json());
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your construction projects</p>
        </div>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No projects found</p>
          <Link href="/projects/new"><Button>Create Your First Project</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const taskProgress = project._counts.tasksTotal > 0
              ? Math.round((project._counts.tasksDone / project._counts.tasksTotal) * 100)
              : 0;
            const budgetTotal = (project.budgetEstimated || 0) + project._changeOrderTotal;
            const budgetPercent = budgetTotal > 0 ? Math.min(100, Math.round((project.budgetActual / budgetTotal) * 100)) : 0;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-primary/50 transition-colors h-full cursor-pointer">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{project.name}</h3>
                        {project.customer && (
                          <p className="text-sm text-muted-foreground">{project.customer.name}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={STATUS_BADGE[project.status] || "secondary"}>
                          {project.status.replace("_", " ")}
                        </Badge>
                        <span className={`text-xs font-medium ${PRIORITY_COLORS[project.priority]}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>

                    {/* Task progress */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Tasks: {project._counts.tasksDone}/{project._counts.tasksTotal}</span>
                        <span>{taskProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${taskProgress}%` }} />
                      </div>
                    </div>

                    {/* Budget */}
                    {budgetTotal > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Budget: ${project.budgetActual.toLocaleString()}</span>
                          <span>${budgetTotal.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${budgetPercent > 100 ? "bg-red-500" : budgetPercent > 85 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project._counts.phases} phases</span>
                      {project.startDate && project.estimatedEnd && (
                        <span>{new Date(project.startDate).toLocaleDateString()} — {new Date(project.estimatedEnd).toLocaleDateString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
