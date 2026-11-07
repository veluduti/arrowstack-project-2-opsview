"use client";

import React from "react";
import { CheckCheck } from "lucide-react";

interface AlertFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSeverity: string;
  onSelectSeverity: (sev: string) => void;
  unreadOnly: boolean;
  onToggleUnreadOnly: () => void;
  onMarkAllRead: () => void;
  hasUnread: boolean;
}

export function AlertFilters({
  selectedCategory,
  onSelectCategory,
  selectedSeverity,
  onSelectSeverity,
  unreadOnly,
  onToggleUnreadOnly,
  onMarkAllRead,
  hasUnread,
}: AlertFiltersProps) {
  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Pending Order SLA", value: "pending_order" },
    { label: "Low Inventory", value: "low_stock" },
    { label: "Payment Failure", value: "payment_failure" },
    { label: "Logistics Delay", value: "delayed_fulfillment" },
    { label: "System Maintenance", value: "system" },
  ];

  const severities = [
    { label: "All Severities", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "Warning", value: "warning" },
    { label: "Info", value: "info" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onSelectCategory(c.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === c.value
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Severity filter & actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => onSelectSeverity(e.target.value)}
              aria-label="Filter alerts by severity"
              className="py-1 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              {severities.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={onToggleUnreadOnly}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Unread Only</span>
          </label>
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All as Read
          </button>
        )}
      </div>
    </div>
  );
}

