"use client";

import React from "react";
import Link from "next/link";
import { OperationalAlert } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
} from "lucide-react";

interface AlertItemProps {
  alert: OperationalAlert;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AlertItem({ alert, onMarkRead, onDismiss }: AlertItemProps) {
  const getSeverityBadge = () => {
    switch (alert.severity) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Critical
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case "info":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  const getCategoryLabel = () => {
    switch (alert.category) {
      case "pending_order":
        return "Pending Order SLA";
      case "low_stock":
        return "Inventory / Stock";
      case "payment_failure":
        return "Payment Gateway";
      case "delayed_fulfillment":
        return "Logistics Route";
      case "system":
        return "System Maintenance";
      default:
        return alert.category;
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        alert.isRead
          ? "bg-white border-slate-200 text-slate-800"
          : "bg-slate-50/80 border-slate-300/80 shadow-xs ring-1 ring-brand-500/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {getSeverityBadge()}
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {getCategoryLabel()}
            </span>
            {!alert.isRead && (
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" title="Unread alert" />
            )}
            <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(alert.timestamp)}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mt-1">{alert.title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {alert.actionUrl && (
              <Link
                href={alert.actionUrl}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
              >
                <span>{alert.actionLabel || "Review Operation"}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}

            {!alert.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(alert.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                Mark as Read
              </button>
            )}

            <button
              type="button"
              onClick={() => onDismiss(alert.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

