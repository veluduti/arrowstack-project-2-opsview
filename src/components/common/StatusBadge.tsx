import React from "react";
import { PaymentStatus, FulfillmentStatus } from "@/types";

interface StatusBadgeProps {
  status: PaymentStatus | FulfillmentStatus | "Active" | "Inactive" | "VIP" | "New" | "Returning" | "High" | "Medium" | "Low";
  type?: "fulfillment" | "payment" | "customer" | "priority";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let style = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    // Fulfillment
    case "Delivered":
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "Shipped":
      style = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "Processing":
      style = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "On Hold":
      style = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case "Cancelled":
      style = "bg-rose-50 text-rose-700 border-rose-200";
      break;

    // Payment
    case "Paid":
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "Pending":
      style = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "Failed":
      style = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "Refunded":
      style = "bg-slate-100 text-slate-700 border-slate-200";
      break;

    // Customer
    case "Active":
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "Inactive":
      style = "bg-slate-100 text-slate-500 border-slate-200";
      break;
    case "VIP":
      style = "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold";
      break;
    case "New":
      style = "bg-sky-50 text-sky-700 border-sky-200";
      break;
    case "Returning":
      style = "bg-teal-50 text-teal-700 border-teal-200";
      break;

    // Priority
    case "High":
      style = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "Medium":
      style = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "Low":
      style = "bg-slate-100 text-slate-600 border-slate-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
}

