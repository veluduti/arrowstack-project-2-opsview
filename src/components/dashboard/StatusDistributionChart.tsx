"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StatusDistribution } from "@/types";
import { formatNumber } from "@/lib/utils";

interface StatusDistributionChartProps {
  data: StatusDistribution[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as StatusDistribution;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700 min-w-[130px]">
          <p className="font-semibold text-slate-200">{item.status}</p>
          <div className="flex justify-between gap-3 text-slate-300">
            <span>Orders:</span>
            <span className="font-bold text-white">{formatNumber(item.count)}</span>
          </div>
          <div className="flex justify-between gap-3 text-slate-300">
            <span>Proportion:</span>
            <span className="font-bold text-brand-300">{item.percentage}%</span>
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
          <h3 className="text-base font-bold text-slate-900">Fulfillment Pipeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">Order progression status distribution</p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          {total} Active Orders
        </span>
      </div>

      <div className="w-full h-56 relative flex items-center justify-center pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={`status-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900">{total}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Orders
          </span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-100">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <div className="min-w-0">
              <p className="font-medium text-slate-700 truncate">{item.status}</p>
              <p className="text-[11px] font-bold text-slate-900">
                {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

