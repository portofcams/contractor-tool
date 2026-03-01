"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyData {
  month: string;
  quotes: number;
  revenue: number;
  accepted: number;
  rejected: number;
  pending: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface TradeData {
  name: string;
  quotes: number;
  revenue: number;
}

interface DashboardStats {
  monthly: MonthlyData[];
  statusBreakdown: StatusData[];
  tradeBreakdown: TradeData[];
}

const STATUS_COLORS: Record<string, string> = {
  Accepted: "#22c55e",
  Sent: "#3b82f6",
  Draft: "#6b7280",
  Rejected: "#ef4444",
};

const TRADE_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f97316"];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
  },
  labelStyle: { color: "#9ca3af" },
};

export function DashboardCharts() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasData = stats.monthly.some((m) => m.quotes > 0);

  if (!hasData) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Quote Volume */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quote Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="quotes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Quotes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                {...tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="url(#revenueGradient)"
                strokeWidth={2}
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      {stats.statusBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quote Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.statusBreakdown.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Revenue by Trade */}
      {stats.tradeBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.tradeBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  width={70}
                />
                <Tooltip
                  {...tooltipStyle}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                  {stats.tradeBreakdown.map((_, i) => (
                    <Cell key={i} fill={TRADE_COLORS[i % TRADE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
