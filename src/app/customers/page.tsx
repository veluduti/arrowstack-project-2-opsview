"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Customer, CustomerGrowthDataPoint } from "@/types";
import { fetchCustomers, fetchCustomerGrowth } from "@/lib/api";
import { useOps } from "@/context/OpsContext";
import { CustomerGrowthChart } from "@/components/customers/CustomerGrowthChart";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { TableSkeleton, ChartSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Users, UserCheck, UserPlus, UserX } from "lucide-react";

export default function CustomersPage() {
  const { dataVersion } = useOps();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [growthData, setGrowthData] = useState<CustomerGrowthDataPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "totalSpent" | "totalOrders" | "joinedDate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [custResult, growthResult] = await Promise.all([
        fetchCustomers({
          search,
          type: typeFilter,
          status: statusFilter,
          sortBy,
          sortOrder,
          page,
          pageSize,
        }),
        fetchCustomerGrowth(),
      ]);

      setCustomers(custResult.customers);
      setTotal(custResult.total);
      setTotalPages(custResult.totalPages);
      setGrowthData(growthResult);
    } catch (err: any) {
      console.error("Customers fetch failed:", err);
      setError(err?.message || "Failed to load customer directory.");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers, dataVersion]);

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  // Metrics calculation
  const totalCount = 192; // overall directory baseline
  const activeCount = 180;
  const newCount = 42;
  const returningCount = 150;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Customer Accounts & Cohorts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Directory of enterprise clients, purchasing histories, and lifetime value analytics
        </p>
      </div>

      {/* KPI Cards: Total, Active, New, Returning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Directory</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
            <span className="text-[11px] text-slate-400">Registered Accounts</span>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Customers</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
            <span className="text-[11px] text-emerald-700 font-semibold">93.8% Engagement Rate</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">New Acquisitions</span>
            <p className="text-2xl font-bold text-sky-600 mt-1">{newCount}</p>
            <span className="text-[11px] text-sky-700 font-semibold">+18.5% This Quarter</span>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Returning Accounts</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{returningCount}</p>
            <span className="text-[11px] text-indigo-700 font-semibold">78.1% Repeat Order Rate</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={loadCustomers} />}

      {/* Cohort Growth Chart */}
      {loading ? <ChartSkeleton height="h-72" /> : <CustomerGrowthChart data={growthData} />}

      {/* Customer Directory Table */}
      {loading ? (
        <TableSkeleton rows={pageSize} cols={8} />
      ) : (
        <CustomerTable
          customers={customers}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          typeFilter={typeFilter}
          onTypeFilterChange={(val) => {
            setTypeFilter(val);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}

