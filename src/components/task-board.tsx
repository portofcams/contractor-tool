"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  estimatedCost: number | null;
  actualCost: number | null;
  order: number;
  phase: { id: string; name: string; color: string | null } | null;
  crewMember: { id: string; name: string } | null;
  subcontractor: { id: string; companyName: string } | null;
}

const COLUMNS = [
  { key: "todo", label: "To Do", color: "bg-gray-500" },
  { key: "in_progress", label: "In Progress", color: "bg-primary" },
  { key: "done", label: "Done", color: "bg-green-500" },
  { key: "blocked", label: "Blocked", color: "bg-yellow-500" },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-500/15 text-gray-500",
  medium: "bg-primary/10 text-primary",
  high: "bg-orange-500/15 text-orange-500",
  urgent: "bg-red-500/15 text-red-500",
};

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  filterPhase?: string;
  filterPriority?: string;
}

export function TaskBoard({ tasks, onStatusChange, onTaskClick, filterPhase, filterPriority }: TaskBoardProps) {
  const filtered = tasks.filter((t) => {
    if (filterPhase && t.phase?.id !== filterPhase) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = filtered.filter((t) => t.status === col.key).sort((a, b) => a.order - b.order);
        return (
          <div key={col.key} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-3 h-3 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="text-xs text-muted-foreground">({colTasks.length})</span>
            </div>
            <div className="space-y-2 min-h-[100px] p-2 rounded-lg bg-secondary/30">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-background border border-border hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{task.title}</p>
                    <Badge className={`text-[10px] shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </Badge>
                  </div>

                  {task.phase && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.phase.color || "#6b7280" }} />
                      <span className="text-[11px] text-muted-foreground">{task.phase.name}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">
                      {task.crewMember?.name || task.subcontractor?.companyName || "Unassigned"}
                    </span>
                    {task.dueDate && (
                      <span className={`text-[11px] ${new Date(task.dueDate) < new Date() && task.status !== "done" ? "text-red-500" : "text-muted-foreground"}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Quick status buttons */}
                  <div className="flex gap-1 mt-2">
                    {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
                      <button
                        key={c.key}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${c.color} text-white opacity-60 hover:opacity-100 transition-opacity`}
                        onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, c.key); }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
