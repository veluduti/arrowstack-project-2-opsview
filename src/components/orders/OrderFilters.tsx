"use client";

import React from "react";
import { Search, RotateCcw, ArrowUpDown } from "lucide-react";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  paymentStatus: string;
  onPaymentStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (field: any) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onReset: () => void;
}

export function OrderFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onReset,
}: OrderFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "All" ||
    paymentStatus !== "All" ||
    sortBy !== "date" ||
    sortOrder !== "desc";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Order ID, Customer, Address, Product..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Fulfillment Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by fulfillment status"
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
          >
            <option value="All">All Fulfillment</option>
            <option value="Delivered">Delivered</option>
            <option value="Shipped">Shipped</option>
            <option value="Processing">Processing</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            aria-label="Filter by payment status"
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Sort By Field */}
        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort by column"
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
          >
            <option value="date">Date Placed</option>
            <option value="amount">Order Amount</option>
            <option value="customerName">Customer Name</option>
            <option value="id">Order ID</option>
          </select>
        </div>

        {/* Sort Direction & Reset */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSortOrder}
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="capitalize">{sortOrder === "asc" ? "Asc" : "Desc"}</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              title="Clear all filters"
              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

