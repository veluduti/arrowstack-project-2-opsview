"use client";

import React, { useState } from "react";
import { DateRangePreset } from "@/types";
import { getStoredOrders, getStoredCustomers, getStoredAlerts, exportToCSV } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useOps } from "@/context/OpsContext";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  BarChart2,
  RefreshCw,
} from "lucide-react";

export function ReportGenerator() {
  const { addToast } = useOps();
  const [selectedRange, setSelectedRange] = useState<DateRangePreset>("30d");
  const [includeRevenue, setIncludeRevenue] = useState(true);
  const [includeOrders, setIncludeOrders] = useState(true);
  const [includeCustomers, setIncludeCustomers] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{
    timestamp: string;
    range: string;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    rows: Record<string, any>[];
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const orders = getStoredOrders();
      const customers = getStoredCustomers();
      const alerts = getStoredAlerts();

      // Compile rows for export
      const rows: Record<string, any>[] = [];

      if (includeOrders) {
        orders.forEach((o) => {
          rows.push({
            ReportSection: "Orders",
            ID: o.id,
            Date: formatDate(o.date),
            EntityName: o.customerName,
            Category: o.productSummary,
            Amount_INR: o.amount,
            Status: o.fulfillmentStatus,
            PaymentStatus: o.paymentStatus,
          });
        });
      }

      if (includeCustomers) {
        customers.forEach((c) => {
          rows.push({
            ReportSection: "Customers",
            ID: c.id,
            Date: formatDate(c.joinedDate),
            EntityName: c.name,
            Category: c.type,
            Amount_INR: c.totalSpent,
            Status: c.status,
            PaymentStatus: `Orders: ${c.totalOrders}`,
          });
        });
      }

      if (includeAlerts) {
        alerts.forEach((a) => {
          rows.push({
            ReportSection: "OperationalAlerts",
            ID: a.id,
            Date: formatDate(a.timestamp),
            EntityName: a.title,
            Category: a.category,
            Amount_INR: 0,
            Status: a.severity,
            PaymentStatus: a.isRead ? "Read" : "Unread",
          });
        });
      }

      const totalRevenue = orders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.amount, 0);

      setGeneratedReport({
        timestamp: new Date().toISOString(),
        range: selectedRange.toUpperCase(),
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customers.length,
        rows,
      });

      setIsGenerating(false);
      addToast({
        type: "success",
        title: "Executive Report Compiled",
        message: `Successfully assembled ${rows.length} audit records across selected data domains.`,
      });
    }, 400);
  };

  const handleDownloadCSV = () => {
    if (!generatedReport || !generatedReport.rows.length) {
      addToast({
        type: "error",
        title: "Export Failed",
        message: "No report dataset available to export. Please generate a report first.",
      });
      return;
    }

    const filename = `OpsView_Executive_Report_${generatedReport.range}_${Date.now()}.csv`;
    const success = exportToCSV(filename, generatedReport.rows);

    if (success) {
      addToast({
        type: "success",
        title: "CSV Download Initiated",
        message: `Saved file "${filename}" with ${generatedReport.rows.length} rows.`,
      });
    } else {
      addToast({
        type: "error",
        title: "Export Interrupted",
        message: "Could not create CSV file stream. Please check browser permissions.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Configure Executive Operational Report</h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate transactional telemetry, customer lifetime cohorts, and pending SLA logs into audit-ready exports.
          </p>
        </div>

        {/* Date window selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Audit Date Window
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(["today", "7d", "30d", "90d", "ytd", "1y"] as DateRangePreset[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRange(r)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase border transition-all ${
                  selectedRange === r
                    ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Section toggles */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Included Operational Domains
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={includeRevenue}
                onChange={(e) => setIncludeRevenue(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Revenue & Margins</p>
                <p className="text-[11px] text-slate-500">Gross turnover & target variance</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={includeOrders}
                onChange={(e) => setIncludeOrders(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Order Ledger</p>
                <p className="text-[11px] text-slate-500">All inbound orders and statuses</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={includeCustomers}
                onChange={(e) => setIncludeCustomers(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Customer Roster</p>
                <p className="text-[11px] text-slate-500">Active accounts and spend stats</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={includeAlerts}
                onChange={(e) => setIncludeAlerts(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Bottlenecks & Alerts</p>
                <p className="text-[11px] text-slate-500">Critical incidents & SLAs</p>
              </div>
            </label>
          </div>
        </div>

        {/* Generate action */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            disabled={isGenerating || (!includeRevenue && !includeOrders && !includeCustomers && !includeAlerts)}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling Telemetry...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                Generate Audit Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Report View */}
      {generatedReport && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Audit Report Ready ({generatedReport.range})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generated at {formatDate(generatedReport.timestamp, true)} • {generatedReport.rows.length} total rows compiled
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Download className="w-4 h-4" />
              Download Report as CSV
            </button>
          </div>

          {/* Quick Metrics from Report */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Orders Analyzed
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                {generatedReport.totalOrders}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Realized Revenue
              </span>
              <span className="text-xl font-bold text-brand-700 mt-1 block">
                {formatCurrency(generatedReport.totalRevenue)}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Registered Customers
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                {generatedReport.totalCustomers}
              </span>
            </div>
          </div>

          {/* Preview Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preview Data Sample (First 6 Records)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Domain</th>
                    <th className="px-4 py-2.5">Record ID</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Name / Description</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {generatedReport.rows.slice(0, 6).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-900">{row.ReportSection}</td>
                      <td className="px-4 py-2 text-slate-600">{row.ID}</td>
                      <td className="px-4 py-2 text-slate-500">{row.Date}</td>
                      <td className="px-4 py-2 text-slate-800 max-w-[200px] truncate">{row.EntityName}</td>
                      <td className="px-4 py-2 font-semibold text-slate-900">
                        {row.Amount_INR ? formatCurrency(row.Amount_INR) : "—"}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{row.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

