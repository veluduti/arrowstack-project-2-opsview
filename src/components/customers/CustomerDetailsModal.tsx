"use client";

import React from "react";
import { Customer } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-brand-500/20">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="customer-details-title" className="text-lg font-bold text-slate-900">
                  {customer.name}
                </h2>
                <StatusBadge status={customer.type} />
                <StatusBadge status={customer.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{customer.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                {customer.totalOrders}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Spend
              </span>
              <span className="text-lg font-bold text-brand-700 mt-0.5 block">
                {formatCurrency(customer.totalSpent, "INR", true)}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Avg Value
              </span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                {formatCurrency(customer.averageOrderValue, "INR", true)}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Contact & Organization
            </h3>

            {customer.company && (
              <div className="flex items-center gap-2 text-slate-700">
                <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{customer.company}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a href={`mailto:${customer.email}`} className="text-brand-600 hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{customer.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Customer since {formatDate(customer.joinedDate)}</span>
            </div>
          </div>

          {customer.notes && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900">
              <strong>Account Memo:</strong> {customer.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

