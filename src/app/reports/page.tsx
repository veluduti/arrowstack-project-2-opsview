"use client";

import React from "react";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Executive Reports & Ledger Exports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Generate comprehensive audit datasets and extract CSV spreadsheets for board presentations
        </p>
      </div>

      <ReportGenerator />
    </div>
  );
}

