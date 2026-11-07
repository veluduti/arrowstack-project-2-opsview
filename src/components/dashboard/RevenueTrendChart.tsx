"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RevenueDataPoint } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, Layers } from "lucide-react";

interface RevenueTrendChartProps {
  data: RevenueDataPoint[];
  title?: string;
  subtitle?: string;
}

export function RevenueTrendChart({
  data,
  title = "Revenue & Operational Trajectory",
  subtitle = "Performance against monthly baseline targets",
}: RevenueTrendChartProps) {
  const [metricView, setMetricView] = useState<"revenue" | "orders" | "all">("revenue");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[170px]">
          <p className="font-semibold text-slate-300 pb-1 border-b border-slate-800">{label}</p>
          {payload.map((item: any) => (
            <div key={item.dataKey} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 capitalize text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-bold text-white">
                {item.dataKey === "orders" ? formatNumber(item.value) : formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +14.9% YoY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* View toggles */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetricView("revenue")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              metricView === "revenue"
                ? "bg-white text-brand-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setMetricView("orders")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              metricView === "orders"
                ? "bg-white text-brand-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setMetricView("all")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              metricView === "all"
                ? "bg-white text-brand-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Combined
          </button>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80 pt-4" aria-label="Revenue and orders trend chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c8de9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0c8de9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (metricView === "orders" ? `${v}` : `₹${v / 1000}k`)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />

            {(metricView === "revenue" || metricView === "all") && (
              <Area
                type="monotone"
                dataKey="revenue"
                name="Actual Revenue"
                stroke="#0c8de9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            )}

            {(metricView === "revenue" || metricView === "all") && (
              <Area
                type="monotone"
                dataKey="target"
                name="Target Baseline"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#targetGradient)"
              />
            )}

            {(metricView === "orders" || metricView === "all") && (
              <Area
                type="monotone"
                dataKey="orders"
                name="Completed Orders"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="sr-only">
        <h4>Data Summary</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
              <th>Target</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td>{formatCurrency(d.revenue)}</td>
                <td>{formatCurrency(d.target)}</td>
                <td>{d.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

