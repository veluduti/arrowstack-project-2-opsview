"use client";

import React, { useState, useEffect, useCallback } from "react";
import { OperationalAlert } from "@/types";
import { fetchAlerts, markAlertAsRead, markAllAlertsAsRead, dismissAlert } from "@/lib/api";
import { useOps } from "@/context/OpsContext";
import { AlertItem } from "@/components/alerts/AlertItem";
import { AlertFilters } from "@/components/alerts/AlertFilters";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { Bell, CheckCheck, ShieldAlert } from "lucide-react";

export default function AlertsPage() {
  const { dataVersion, triggerRefresh, addToast, requestConfirm } = useOps();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<OperationalAlert[]>([]);
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAlerts({
        category,
        severity,
        unreadOnly,
      });

      setAlerts(data);
    } catch (err: any) {
      console.error("Alerts fetch error:", err);
      setError(err?.message || "Failed to load operational alerts.");
    } finally {
      setLoading(false);
    }
  }, [category, severity, unreadOnly]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts, dataVersion]);

  const handleMarkRead = async (id: string) => {
    await markAlertAsRead(id);
    triggerRefresh();
    addToast({
      type: "info",
      title: "Alert Status Updated",
      message: `Alert ${id} acknowledged and marked as read.`,
      duration: 2000,
    });
  };

  const handleMarkAllRead = async () => {
    await markAllAlertsAsRead();
    triggerRefresh();
    addToast({
      type: "success",
      title: "All Alerts Acknowledged",
      message: "Cleared unread status across all active alerts.",
    });
  };

  const handleDismiss = (id: string) => {
    requestConfirm({
      title: "Dismiss Alert Notification?",
      message: "This will remove the alert from your operational feed. You can restore baseline notifications anytime using 'Reset Baseline' in the demo header.",
      confirmLabel: "Dismiss Alert",
      destructive: true,
      onConfirm: async () => {
        await dismissAlert(id);
        triggerRefresh();
        addToast({
          type: "info",
          title: "Alert Dismissed",
          message: `Dismissed alert ${id} from active feed.`,
        });
      },
    });
  };

  const hasUnread = alerts.some((a) => !a.isRead);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Operational Alerts & System Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time triage of logistics delays, inventory thresholds, and payment processing incidents
        </p>
      </div>

      {/* Filters Toolbar */}
      <AlertFilters
        selectedCategory={category}
        onSelectCategory={setCategory}
        selectedSeverity={severity}
        onSelectSeverity={setSeverity}
        unreadOnly={unreadOnly}
        onToggleUnreadOnly={() => setUnreadOnly((prev) => !prev)}
        onMarkAllRead={handleMarkAllRead}
        hasUnread={hasUnread}
      />

      {error && <ErrorState message={error} onRetry={loadAlerts} />}

      {/* Alerts Feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          title="No operational alerts match filters"
          description="Everything is running within normal parameters. There are no active bottleneck notifications for this filter criteria."
          icon={<ShieldAlert className="w-8 h-8 text-emerald-500" />}
          actionLabel="Clear Alert Filters"
          onAction={() => {
            setCategory("all");
            setSeverity("all");
            setUnreadOnly(false);
          }}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
}

