"use client";

import React from "react";
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
import { CustomerGrowthDataPoint } from "@/types";
import { formatNumber } from "@/lib/utils";

interface CustomerGrowthChartProps {
  data: CustomerGrowthDataPoint[];
}

export function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700 min-w-[150px]">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((item: any) => (
            <div key={item.dataKey} className="flex justify-between gap-3 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-bold text-white">{formatNumber(item.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cohort Growth & Retention</h3>
          <p className="text-xs text-slate-500 mt-0.5">Customer expansion dynamics across fiscal periods</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
          +9.1% Active Surge
        </span>
      </div>

      <div className="w-full h-64 pt-3" aria-label="Customer Growth Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="newCustGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="retCustGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
            <Area
              type="monotone"
              dataKey="returningCustomers"
              name="Returning Accounts"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#retCustGrad)"
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              name="New Acquisitions"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#newCustGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

