"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Stats {
  completion: number;
  totalTasks: number;
  doneTasks: number;
  blockedTasks: number;
  daysRemaining: number | null;
  budgetEstimated: number;
  budgetAdjusted: number;
  budgetSpent: number;
  budgetHealth: string;
  scheduleHealth: string;
  totalPhases: number;
  donePhases: number;
}

export function ProjectStats({ stats }: { stats: Stats }) {
  const budgetColor = stats.budgetHealth === "over" ? "text-red-500" : stats.budgetHealth === "warning" ? "text-yellow-500" : "text-green-500";
  const schedColor = stats.scheduleHealth === "overdue" ? "text-red-500" : stats.scheduleHealth === "behind" ? "text-yellow-500" : "text-green-500";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  className="text-secondary"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="3"
                  strokeDasharray={`${stats.completion}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {stats.completion}%
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">Completion</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 text-center">
          <p className={`text-3xl font-bold ${schedColor}`}>
            {stats.daysRemaining !== null ? (stats.daysRemaining < 0 ? `${Math.abs(stats.daysRemaining)}d over` : `${stats.daysRemaining}d`) : "—"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {stats.daysRemaining !== null && stats.daysRemaining < 0 ? "Overdue" : "Days Remaining"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{stats.doneTasks}<span className="text-lg text-muted-foreground">/{stats.totalTasks}</span></p>
          <p className="text-sm text-muted-foreground mt-2">Tasks Done</p>
          {stats.blockedTasks > 0 && (
            <p className="text-xs text-yellow-500 mt-1">{stats.blockedTasks} blocked</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 text-center">
          <p className={`text-2xl font-bold ${budgetColor}`}>
            ${stats.budgetSpent.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            of ${stats.budgetAdjusted.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.budgetHealth === "over" ? "Over Budget" : stats.budgetHealth === "warning" ? "Near Limit" : "On Track"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
