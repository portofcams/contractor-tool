"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Phase {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  color: string | null;
  dependsOnId: string | null;
  dependsOn: { id: string; name: string } | null;
  _tasksDone: number;
  _tasksTotal: number;
  _isCritical: boolean;
  tasks: { id: string; title: string; status: string; dueDate: string | null; completedAt: string | null }[];
}

interface TimelineData {
  phases: Phase[];
  criticalPath: string[];
  projectStart: string | null;
  projectEnd: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-400",
  in_progress: "bg-primary",
  completed: "bg-green-500",
  blocked: "bg-yellow-500",
  skipped: "bg-gray-300",
};

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

export function ProjectTimeline({ data, onSelectPhase }: { data: TimelineData; onSelectPhase?: (id: string) => void }) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  if (!data.phases.length) {
    return <p className="text-muted-foreground text-center py-8">No phases yet. Add your first phase to see the timeline.</p>;
  }

  // Calculate date range
  const allDates = data.phases.flatMap((p) => [p.startDate, p.endDate, p.actualStart, p.actualEnd].filter(Boolean)) as string[];
  if (data.projectStart) allDates.push(data.projectStart);
  if (data.projectEnd) allDates.push(data.projectEnd);

  if (allDates.length === 0) {
    return (
      <div className="space-y-3">
        {data.phases.map((phase) => (
          <div key={phase.id} className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <span className="font-medium">{phase.name}</span>
              <Badge variant={phase.status === "completed" ? "default" : "secondary"}>{phase.status.replace("_", " ")}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">No dates set — add start/end dates to see timeline bars</p>
          </div>
        ))}
      </div>
    );
  }

  const minDate = new Date(allDates.reduce((a, b) => (a < b ? a : b)));
  const maxDate = new Date(allDates.reduce((a, b) => (a > b ? a : b)));
  const today = new Date();

  // Add padding
  minDate.setDate(minDate.getDate() - 3);
  maxDate.setDate(maxDate.getDate() + 7);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = 100 / totalDays;

  function dateToPercent(dateStr: string): number {
    const d = new Date(dateStr);
    const days = (d.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    return (days / totalDays) * 100;
  }

  const todayPercent = ((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;

  // Generate week labels
  const weeks: { label: string; left: number }[] = [];
  const cursor = new Date(minDate);
  cursor.setDate(cursor.getDate() - cursor.getDay()); // Align to Sunday
  while (cursor <= maxDate) {
    const pct = ((cursor.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
    if (pct >= 0 && pct <= 100) {
      weeks.push({ label: `${cursor.getMonth() + 1}/${cursor.getDate()}`, left: pct });
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return (
    <div className="space-y-1">
      {/* Week headers */}
      <div className="relative h-6 border-b border-border mb-2">
        {weeks.map((w, i) => (
          <span key={i} className="absolute text-[10px] text-muted-foreground" style={{ left: `${w.left}%` }}>
            {w.label}
          </span>
        ))}
      </div>

      {/* Today marker */}
      {todayPercent >= 0 && todayPercent <= 100 && (
        <div className="relative h-0">
          <div className="absolute top-0 bottom-0 w-px bg-red-500 z-10" style={{ left: `${todayPercent}%`, height: `${data.phases.length * 56 + 20}px` }}>
            <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-red-500 font-medium">Today</span>
          </div>
        </div>
      )}

      {/* Phase bars */}
      {data.phases.map((phase, i) => {
        const start = phase.startDate || phase.actualStart;
        const end = phase.endDate || phase.actualEnd;
        if (!start || !end) {
          return (
            <div key={phase.id} className="relative h-12 flex items-center">
              <span className="text-sm text-muted-foreground truncate w-full">{phase.name} (no dates)</span>
            </div>
          );
        }

        const left = dateToPercent(start);
        const right = dateToPercent(end);
        const width = Math.max(right - left, dayWidth);
        const color = phase.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const progress = phase._tasksTotal > 0 ? (phase._tasksDone / phase._tasksTotal) * 100 : 0;

        return (
          <div key={phase.id}>
            <div
              className="relative h-12 flex items-center cursor-pointer group"
              onClick={() => {
                setExpandedPhase(expandedPhase === phase.id ? null : phase.id);
                onSelectPhase?.(phase.id);
              }}
            >
              {/* Dependency line */}
              {phase.dependsOnId && (
                <div className="absolute left-0 top-1/2 w-2 h-px bg-muted-foreground" style={{ left: `${left - 1}%` }} />
              )}

              {/* Bar background */}
              <div
                className={`absolute h-8 rounded-md opacity-30 ${phase._isCritical ? "ring-2 ring-red-500" : ""}`}
                style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color }}
              />
              {/* Progress fill */}
              <div
                className="absolute h-8 rounded-md transition-all"
                style={{ left: `${left}%`, width: `${width * (progress / 100)}%`, backgroundColor: color }}
              />
              {/* Label */}
              <div className="absolute flex items-center gap-2 px-2 h-8" style={{ left: `${left}%`, width: `${width}%` }}>
                <span className="text-xs font-medium text-white truncate drop-shadow-sm">{phase.name}</span>
                {phase._isCritical && <span className="text-[9px] bg-red-500/80 text-white px-1 rounded">CP</span>}
              </div>
              {/* Right label */}
              <span
                className="absolute text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${left + width + 0.5}%` }}
              >
                {phase._tasksDone}/{phase._tasksTotal} tasks
              </span>
            </div>

            {/* Expanded tasks */}
            {expandedPhase === phase.id && phase.tasks.length > 0 && (
              <div className="ml-4 mb-2 space-y-1">
                {phase.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-xs py-1">
                    <span className={`w-2 h-2 rounded-full ${task.status === "done" ? "bg-green-500" : task.status === "in_progress" ? "bg-primary" : task.status === "blocked" ? "bg-yellow-500" : "bg-gray-400"}`} />
                    <span className={task.status === "done" ? "line-through text-muted-foreground" : ""}>{task.title}</span>
                    {task.dueDate && <span className="text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
