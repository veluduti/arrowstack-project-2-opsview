"use client";

import React from "react";
import Link from "next/link";
import { OperationalAlert } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface OperationalAlertsListProps {
  alerts: OperationalAlert[];
  onMarkRead?: (id: string) => void;
}

export function OperationalAlertsList({ alerts, onMarkRead }: OperationalAlertsListProps) {
  const activeAlerts = alerts.filter((a) => !a.isDismissed).slice(0, 4);

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityBorder = (sev: string) => {
    switch (sev) {
      case "critical":
        return "border-l-4 border-l-rose-500 bg-rose-50/30";
      case "warning":
        return "border-l-4 border-l-amber-500 bg-amber-50/30";
      case "info":
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50/30";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900">Operational Bottlenecks & Alerts</h3>
        </div>
        <Link
          href="/alerts"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          Manage All Alerts
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {activeAlerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No unresolved operational alerts currently recorded.
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 transition-colors hover:bg-slate-50/80 flex items-start gap-3 ${getSeverityBorder(
                alert.severity
              )}`}
            >
              <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {alert.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2"
                    >
                      {alert.actionLabel || "Resolve Issue"} &rarr;
                    </Link>
                  )}
                  {onMarkRead && !alert.isRead && (
                    <button
                      type="button"
                      onClick={() => onMarkRead(alert.id)}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-800 ml-auto inline-flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

