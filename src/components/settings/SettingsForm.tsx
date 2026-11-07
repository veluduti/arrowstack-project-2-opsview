"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOps } from "@/context/OpsContext";
import { UserSettings } from "@/types";
import { Save, User, Sliders, Bell, CheckCircle2, Shield } from "lucide-react";

const settingsSchema = z.object({
  fullName: z.string().min(2, "Full name must have at least 2 characters"),
  email: z.string().email("Please enter a valid business email address"),
  role: z.string().min(2, "Role is required"),
  companyName: z.string().min(2, "Company name is required"),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  refreshInterval: z.coerce.number().min(15, "Refresh interval must be at least 15 seconds").max(3600),
  emailAlerts: z.boolean(),
  criticalAlertsPush: z.boolean(),
  weeklyDigest: z.boolean(),
  compactTables: z.boolean(),
  colorTheme: z.enum(["light", "system"]),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { settings, updateSettings, addToast } = useOps();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings(data);
    reset(data);
    addToast({
      type: "success",
      title: "Preferences Saved",
      message: "Your executive dashboard settings and notification rules have been updated in LocalStorage.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Executive Identity & Organization</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className={`w-full text-xs sm:text-sm p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.fullName ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full text-xs sm:text-sm p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.email ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title / Designation
            </label>
            <input
              type="text"
              {...register("role")}
              className={`w-full text-xs sm:text-sm p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.role ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {errors.role && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enterprise Unit / Company
            </label>
            <input
              type="text"
              {...register("companyName")}
              className={`w-full text-xs sm:text-sm p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.companyName ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {errors.companyName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.companyName.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Dashboard & Localization Preferences</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reporting Currency
            </label>
            <select
              {...register("currency")}
              className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Auto-Telemetry Refresh Rate (Seconds)
            </label>
            <input
              type="number"
              {...register("refreshInterval")}
              className={`w-full text-xs sm:text-sm p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.refreshInterval ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {errors.refreshInterval && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.refreshInterval.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 pt-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                {...register("compactTables")}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Compact Density Table Layout</p>
                <p className="text-[11px] text-slate-500">
                  Condenses padding on order & customer tables to maximize screen efficiency on executive displays.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Incident & Notification Channels</h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
            <input
              type="checkbox"
              {...register("criticalAlertsPush")}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">High-Priority SLA Push Notifications</p>
              <p className="text-[11px] text-slate-500">
                Immediately trigger audio-visual warnings when orders exceed the 24-hour verification window.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
            <input
              type="checkbox"
              {...register("emailAlerts")}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Email Gateway Alerts</p>
              <p className="text-[11px] text-slate-500">
                Forward failed payment authorizations and low-inventory warnings directly to executive inbox.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
            <input
              type="checkbox"
              {...register("weeklyDigest")}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Weekly Executive Operational Digest</p>
              <p className="text-[11px] text-slate-500">
                Receive consolidated week-over-week revenue metrics and order fulfillment KPIs every Monday at 08:00 IST.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </form>
  );
}
