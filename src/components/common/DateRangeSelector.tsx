"use client";

import React from "react";
import { useOps } from "@/context/OpsContext";
import { DateRangePreset } from "@/types";
import { Calendar } from "lucide-react";

interface DateRangeSelectorProps {
  value?: DateRangePreset;
  onChange?: (val: DateRangePreset) => void;
  className?: string;
}

export function DateRangeSelector({ value, onChange, className = "" }: DateRangeSelectorProps) {
  const { dateRange: contextDateRange, setDateRange: setContextDateRange, addToast } = useOps();

  const selectedRange = value || contextDateRange;
  const handleChange = (range: DateRangePreset) => {
    if (onChange) {
      onChange(range);
    } else {
      setContextDateRange(range);
      addToast({
        type: "info",
        title: "Date Window Updated",
        message: `Dashboard data recalculated for preset: ${range.toUpperCase()}`,
        duration: 2500,
      });
    }
  };

  const options: { label: string; value: DateRangePreset }[] = [
    { label: "Today", value: "today" },
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
    { label: "YTD", value: "ytd" },
    { label: "1Y", value: "1y" },
  ];

  return (
    <div
      role="group"
      aria-label="Select date range filter"
      className={`inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-1.5 px-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Range</span>
      </div>
      <div className="flex items-center gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange(opt.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              selectedRange === opt.value
                ? "bg-white text-brand-700 shadow-xs font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

