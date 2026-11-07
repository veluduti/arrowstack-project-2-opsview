"use client";

import React, { useState } from "react";
import { useOps } from "@/context/OpsContext";
import { Info, RotateCcw, AlertTriangle, X } from "lucide-react";

export function DemoBanner() {
  const { isSimulatingError, toggleSimulateError, resetAllDemoData, requestConfirm } = useOps();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleReset = () => {
    requestConfirm({
      title: "Reset Demo Environment?",
      message: "This will restore all modified orders, alert read-states, and analytics records back to the initial baseline dataset.",
      confirmLabel: "Reset Baseline Data",
      destructive: true,
      onConfirm: () => resetAllDemoData(),
    });
  };

  return (
    <div
      role="region"
      aria-label="Demonstration environment notice"
      className="bg-brand-50 border-b border-brand-100 text-brand-900 px-4 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 font-semibold uppercase tracking-wider text-[10px]">
          <Info className="w-3 h-3" /> Demo Mode
        </span>
        <span className="text-slate-700">
          OpsView Enterprise UI – Active demonstration dataset with simulated REST latency and LocalStorage state.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSimulateError}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
            isSimulatingError
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
          title="Toggle 503 Server Anomaly Simulation to verify error boundaries"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {isSimulatingError ? "Simulated Anomaly: ACTIVE" : "Simulate API Error"}
        </button>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Restore mock data to baseline state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset Baseline
        </button>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="p-1 rounded text-slate-400 hover:text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

