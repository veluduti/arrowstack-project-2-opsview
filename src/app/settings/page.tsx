"use client";

import React from "react";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Executive Settings & Console Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your executive credentials, currency standards, and incident dispatch thresholds
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}

