"use client";

import React, { useState } from "react";
import { Order, FulfillmentStatus, PaymentStatus } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Package,
} from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (column: any) => void;
  onRefreshOrders?: () => void;
}

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSortChange,
  onRefreshOrders,
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const renderSortHeader = (label: string, field: string) => {
    const isSorted = sortBy === field;
    return (
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className="group inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 focus:outline-none focus:text-slate-900"
      >
        <span>{label}</span>
        <ArrowUpDown
          className={`w-3.5 h-3.5 transition-colors ${
            isSorted ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Top summary row */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Package className="w-4 h-4 text-slate-500" />
          <span>
            Displaying {orders.length} of {total} total orders
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="page-size-select" className="text-slate-500 font-medium">
            Rows per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="p-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="No orders found"
            description="No transaction logs match the current search query or applied status filters."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  {renderSortHeader("Order ID", "id")}
                </th>
                <th scope="col" className="px-4 py-3.5">
                  {renderSortHeader("Customer", "customerName")}
                </th>
                <th scope="col" className="px-4 py-3.5">
                  {renderSortHeader("Order Date", "date")}
                </th>
                <th scope="col" className="px-4 py-3.5">Product or Service</th>
                <th scope="col" className="px-4 py-3.5">
                  {renderSortHeader("Amount", "amount")}
                </th>
                <th scope="col" className="px-4 py-3.5">Payment</th>
                <th scope="col" className="px-4 py-3.5">Fulfillment</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-brand-50/30 transition-colors group"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-4 py-3.5 max-w-[220px] truncate text-slate-700">
                    {order.productSummary}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={order.fulfillmentStatus} />
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
          <span className="text-slate-500">
            Page <strong className="text-slate-800">{page}</strong> of{" "}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // Only render nearby pages for clean pagination
              if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      p === page
                        ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              if (p === page - 2 || p === page + 2) {
                return (
                  <span key={p} className="px-1 text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updated) => {
            setSelectedOrder(updated);
            if (onRefreshOrders) onRefreshOrders();
          }}
        />
      )}
    </div>
  );
}

