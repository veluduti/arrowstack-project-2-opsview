"use client";

import React, { useState } from "react";
import { Customer } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { CustomerDetailsModal } from "./CustomerDetailsModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
  RotateCcw,
} from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (field: any) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onResetFilters: () => void;
}

export function CustomerTable({
  customers,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onResetFilters,
}: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const hasFilters =
    search.trim() !== "" || typeFilter !== "All" || statusFilter !== "All" || sortBy !== "name";

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Customer name, company, email, location..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              aria-label="Filter by customer cohort"
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              <option value="All">All Cohorts</option>
              <option value="VIP">VIP</option>
              <option value="Returning">Returning</option>
              <option value="New">New</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter by customer account status"
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              aria-label="Sort by customer field"
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              <option value="name">Name</option>
              <option value="totalSpent">Total Spend</option>
              <option value="totalOrders">Order Count</option>
              <option value="joinedDate">Joined Date</option>
            </select>
          </div>

          <div className="lg:col-span-1 flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleSortOrder}
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                title="Reset filters"
                className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No customer accounts found"
              description="No customer accounts match your current search queries or segment filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Customer / Company</th>
                  <th scope="col" className="px-4 py-3.5">Cohort</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Orders</th>
                  <th scope="col" className="px-4 py-3.5">Lifetime Spend</th>
                  <th scope="col" className="px-4 py-3.5">Location</th>
                  <th scope="col" className="px-4 py-3.5">Joined</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.company || c.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.type} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {c.totalOrders}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-brand-700">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {c.location}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(c.joinedDate)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
            <span className="text-slate-500">
              Showing page <strong className="text-slate-800">{page}</strong> of{" "}
              <strong className="text-slate-800">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

