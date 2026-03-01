"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  jobNumber: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  crew?: string;
  quote?: {
    quoteNumber: string;
    trade: string;
    total: number;
    customer: {
      name: string;
      phone?: string;
      email?: string;
    };
  };
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-600",
  in_progress: "bg-yellow-500",
  completed: "bg-green-600",
  cancelled: "bg-red-600",
};

const STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  scheduled: "secondary",
  in_progress: "outline",
  completed: "default",
  cancelled: "destructive",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function JobsCalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function getJobsForDay(day: number): Job[] {
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduledDate);
      return (
        jobDate.getFullYear() === year &&
        jobDate.getMonth() === month &&
        jobDate.getDate() === day
      );
    });
  }

  async function updateJobStatus(jobId: string, status: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchJobs();
        if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob({ ...selectedJob, status: status as Job["status"] });
        }
      }
    } catch {
      // silently fail
    }
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Build calendar grid cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Jobs Calendar</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading jobs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs Calendar</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-600" />{" "}
            Scheduled
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 ml-2" />{" "}
            In Progress
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 ml-2" />{" "}
            Completed
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 ml-2" />{" "}
            Cancelled
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              &larr; Prev
            </Button>
            <CardTitle>
              {monthName} {year}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              Next &rarr;
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, idx) => {
              const dayJobs = day ? getJobsForDay(day) : [];
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[80px] rounded-md border border-border p-1 ${
                    day ? "bg-secondary/30" : "bg-transparent border-transparent"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-xs font-medium ${
                          isToday
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {dayJobs.map((job) => (
                          <button
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className="w-full text-left"
                          >
                            <div className="flex items-center gap-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                                  STATUS_COLORS[job.status] || "bg-gray-400"
                                }`}
                              />
                              <span className="text-[10px] leading-tight truncate">
                                {job.quote?.customer?.name || job.jobNumber}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job Detail Panel */}
      {selectedJob && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Job {selectedJob.jobNumber}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_BADGE_VARIANT[selectedJob.status]}>
                  {selectedJob.status.replace("_", " ")}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedJob.quote && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {selectedJob.quote.customer.name}
                  </p>
                  {selectedJob.quote.customer.phone && (
                    <p className="text-sm text-muted-foreground">
                      {selectedJob.quote.customer.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quote</p>
                  <p className="font-medium">
                    {selectedJob.quote.quoteNumber} &middot;{" "}
                    <span className="capitalize">{selectedJob.quote.trade}</span>{" "}
                    &middot; ${selectedJob.quote.total.toLocaleString()}
                  </p>
                </div>
              </>
            )}
            {selectedJob.crew && (
              <div>
                <p className="text-sm text-muted-foreground">Crew</p>
                <p className="font-medium">{selectedJob.crew}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="font-medium">
                {new Date(selectedJob.scheduledDate).toLocaleDateString()}
              </p>
            </div>
            {selectedJob.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{selectedJob.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {selectedJob.status === "scheduled" && (
                <Button
                  size="sm"
                  onClick={() =>
                    updateJobStatus(selectedJob.id, "in_progress")
                  }
                >
                  Start Job
                </Button>
              )}
              {selectedJob.status === "in_progress" && (
                <Button
                  size="sm"
                  onClick={() =>
                    updateJobStatus(selectedJob.id, "completed")
                  }
                >
                  Complete Job
                </Button>
              )}
              {selectedJob.status !== "cancelled" &&
                selectedJob.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateJobStatus(selectedJob.id, "cancelled")
                    }
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
