"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RevenueDataPoint,
  CategorySalesData,
  CustomerGrowthDataPoint,
  StatusDistribution,
  DateRangePreset,
} from "@/types";
import {
  fetchRevenueTrends,
  fetchCategorySales,
  fetchCustomerGrowth,
  fetchStatusDistribution,
} from "@/lib/api";
import { useOps } from "@/context/OpsContext";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { ChartSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from "lucide-react";

export default function AnalyticsPage() {
  const { dataVersion, dateRange, setDateRange } = useOps();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [granularity, setGranularity] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [revenueTrends, setRevenueTrends] = useState<RevenueDataPoint[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySalesData[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowthDataPoint[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistribution[]>([]);

  // Performance benchmark comparison state
  const [benchmarkView, setBenchmarkView] = useState<"revenue" | "margin">("revenue");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [revData, catData, custData, statusData] = await Promise.all([
        fetchRevenueTrends(granularity),
        fetchCategorySales(),
        fetchCustomerGrowth(),
        fetchStatusDistribution(),
      ]);

      setRevenueTrends(revData);
      setCategorySales(catData);
      setCustomerGrowth(custData);
      setStatusDist(statusData);
    } catch (err: any) {
      console.error("Analytics load failure:", err);
      setError(err?.message || "Failed to load operational analytics dataset.");
    } finally {
      setLoading(false);
    }
  }, [granularity]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics, dataVersion]);

  // Handle date range changing granularity
  const handleRangePresetChange = (preset: DateRangePreset) => {
    setDateRange(preset);
    if (preset === "today" || preset === "7d") {
      setGranularity("daily");
    } else if (preset === "30d") {
      setGranularity("weekly");
    } else {
      setGranularity("monthly");
    }
  };

  const totalPeriodRevenue = revenueTrends.reduce((s, r) => s + r.revenue, 0);
  const totalPeriodTarget = revenueTrends.reduce((s, r) => s + r.target, 0);
  const totalPeriodExpenses = revenueTrends.reduce((s, r) => s + r.expenses, 0);
  const totalNetMargin = revenueTrends.reduce((s, r) => s + r.netMargin, 0);
  const targetVariance = totalPeriodTarget > 0 ? ((totalPeriodRevenue - totalPeriodTarget) / totalPeriodTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Operations & Financial Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Multi-dimensional trend models, target variances, and customer retention metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Granularity Selector */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {(["monthly", "weekly", "daily"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                className={`px-3 py-1 font-semibold rounded-lg capitalize transition-all ${
                  granularity === g
                    ? "bg-white text-brand-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <DateRangeSelector value={dateRange} onChange={handleRangePresetChange} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={loadAnalytics} />}

      {/* Analytics Benchmark Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Period Revenue</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(totalPeriodRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Target: <strong className="text-slate-700">{formatCurrency(totalPeriodTarget)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Target Variance</span>
            <div className={`p-2 rounded-xl ${targetVariance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 flex items-center gap-1.5">
            {targetVariance >= 0 ? (
              <span className="text-emerald-600">+{targetVariance.toFixed(1)}%</span>
            ) : (
              <span className="text-rose-600">{targetVariance.toFixed(1)}%</span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-1">Relative to operational budget</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Operating Expenses</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(totalPeriodExpenses)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Logistics, cloud & fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Net Margin Contribution</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {formatCurrency(totalNetMargin)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {totalPeriodRevenue > 0
              ? `${((totalNetMargin / totalPeriodRevenue) * 100).toFixed(1)}% net operating margin`
              : "0% margin"}
          </p>
        </div>
      </div>

      {/* Main Charts: Revenue vs Target & Expenses Stack */}
      {loading ? (
        <ChartSkeleton height="h-96" />
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Revenue, Target & Operating Expense Analysis ({granularity.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500">
                Tracking top-line velocity against operational outlays and executive targets
              </p>
            </div>

            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setBenchmarkView("revenue")}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  benchmarkView === "revenue"
                    ? "bg-white text-brand-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Revenue vs Target
              </button>
              <button
                type="button"
                onClick={() => setBenchmarkView("margin")}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  benchmarkView === "margin"
                    ? "bg-white text-brand-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Net Margin Stack
              </button>
            </div>
          </div>

          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />

                {benchmarkView === "revenue" ? (
                  <>
                    <Bar dataKey="revenue" name="Actual Revenue" fill="#0c8de9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target Plan" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="expenses" name="Operating Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netMargin" name="Net Operational Margin" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Row 2: Customer Cohort Growth & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <ChartSkeleton height="h-80" />
            <ChartSkeleton height="h-80" />
          </>
        ) : (
          <>
            {/* Customer Cohort Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Customer Acquisition & Retention</h3>
                  <p className="text-xs text-slate-500">New additions vs returning customer accounts</p>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="w-full h-64 pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowth} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
                    <Line
                      type="monotone"
                      dataKey="totalActive"
                      name="Total Active"
                      stroke="#0c8de9"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="returningCustomers"
                      name="Returning Customers"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newCustomers"
                      name="New Customers"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Vertical Profitability & Volume</h3>
                  <p className="text-xs text-slate-500">Order count and growth trajectory by sector</p>
                </div>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>

              <div className="divide-y divide-slate-100 pt-1">
                {categorySales.map((cat) => (
                  <div key={cat.category} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{cat.category}</p>
                      <p className="text-[11px] text-slate-500">
                        {cat.orders} orders • {cat.percentage}% share
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(cat.revenue)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          cat.growth >= 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {cat.growth >= 0 ? "+" : ""}
                        {cat.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

