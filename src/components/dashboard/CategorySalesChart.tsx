"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CategorySalesData } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface CategorySalesChartProps {
  data: CategorySalesData[];
}

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategorySalesData;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700 min-w-[160px]">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{item.category}</p>
          <div className="flex justify-between gap-3 pt-1">
            <span className="text-slate-400">Revenue:</span>
            <span className="font-bold text-white">{formatCurrency(item.revenue)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Share:</span>
            <span className="font-bold text-brand-300">{item.percentage}%</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Orders:</span>
            <span className="font-bold text-white">{formatNumber(item.orders)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Revenue by Vertical</h3>
          <p className="text-xs text-slate-500 mt-0.5">Category contribution to aggregate turnover</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
          5 Verticals
        </span>
      </div>

      <div className="w-full h-64 pt-3" aria-label="Sales by Category Horizontal Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown list below chart */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {data.map((cat) => (
          <div key={cat.category} className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="font-medium text-slate-700 truncate">{cat.category}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 font-semibold text-slate-900">
              <span>{cat.percentage}%</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">{formatCurrency(cat.revenue, "INR", true)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

