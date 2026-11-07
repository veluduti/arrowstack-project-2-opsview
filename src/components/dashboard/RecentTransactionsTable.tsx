"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, Eye } from "lucide-react";

interface RecentTransactionsTableProps {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

export function RecentTransactionsTable({ orders, onSelectOrder }: RecentTransactionsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time ledger of inbound operational orders</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All Orders
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3">Order</th>
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Product / Service</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Amount</th>
              <th scope="col" className="px-4 py-3">Fulfillment</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {order.id}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{order.customerName}</div>
                  <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate text-slate-700">
                  {order.productSummary}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                  {formatDate(order.date)}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {formatCurrency(order.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={order.fulfillmentStatus} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {onSelectOrder ? (
                    <button
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={`/orders?search=${order.id}`}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-block"
                      title="View in Orders"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

