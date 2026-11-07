"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  MetricCardData,
  RevenueDataPoint,
  CategorySalesData,
  StatusDistribution,
  Order,
  OperationalAlert,
} from "@/types";
import {
  fetchOverviewMetrics,
  fetchRevenueTrends,
  fetchCategorySales,
  fetchStatusDistribution,
  fetchOrders,
  fetchAlerts,
  markAlertAsRead,
} from "@/lib/api";
import { useOps } from "@/context/OpsContext";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { CategorySalesChart } from "@/components/dashboard/CategorySalesChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { OperationalAlertsList } from "@/components/dashboard/OperationalAlertsList";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Sparkles, Activity } from "lucide-react";

export default function OverviewPage() {
  const { dataVersion, dateRange, triggerRefresh, addToast } = useOps();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<MetricCardData[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<RevenueDataPoint[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySalesData[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistribution[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<OperationalAlert[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine granularity based on dateRange preset
      const granularity = dateRange === "7d" || dateRange === "today" ? "daily" : dateRange === "30d" ? "weekly" : "monthly";

      const [metricsRes, revenueRes, catSalesRes, statusDistRes, ordersRes, alertsRes] =
        await Promise.all([
          fetchOverviewMetrics(),
          fetchRevenueTrends(granularity),
          fetchCategorySales(),
          fetchStatusDistribution(),
          fetchOrders({ pageSize: 5, sortBy: "date", sortOrder: "desc" }),
          fetchAlerts({ unreadOnly: false }),
        ]);

      setMetrics(metricsRes);
      setRevenueTrends(revenueRes);
      setCategorySales(catSalesRes);
      setStatusDist(statusDistRes);
      setRecentOrders(ordersRes.orders);
      setAlerts(alertsRes);
    } catch (err: any) {
      console.error("Dashboard data load error:", err);
      setError(err?.message || "Failed to load operations dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, dataVersion]);

  const handleMarkAlertRead = async (id: string) => {
    await markAlertAsRead(id);
    triggerRefresh();
    addToast({
      type: "info",
      title: "Alert Acknowledged",
      message: `Marked alert ${id} as read.`,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar with title and quick date filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Operations Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Executive performance indicators, fulfillment bottlenecks, and transaction flows
          </p>
        </div>

        <DateRangeSelector />
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={loadDashboardData} />}

      {/* Loading state for KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      ) : (
        /* KPI Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.id} metric={m} />
          ))}
        </div>
      )}

      {/* Charts Row: Revenue Trend & Order Status Distribution */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton height="h-96" />
          </div>
          <div>
            <ChartSkeleton height="h-96" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueTrendChart data={revenueTrends} />
          </div>
          <div>
            <StatusDistributionChart data={statusDist} />
          </div>
        </div>
      )}

      {/* Category Sales & Operational Alerts Row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height="h-80" />
          <ChartSkeleton height="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategorySalesChart data={categorySales} />
          <OperationalAlertsList alerts={alerts} onMarkRead={handleMarkAlertRead} />
        </div>
      )}

      {/* Recent Transactions Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (
        <RecentTransactionsTable orders={recentOrders} />
      )}
    </div>
  );
}

