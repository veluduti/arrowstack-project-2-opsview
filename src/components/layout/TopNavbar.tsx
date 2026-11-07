"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOps } from "@/context/OpsContext";
import {
  Menu,
  Search,
  Bell,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const router = useRouter();
  const { unreadAlertsCount, triggerRefresh, addToast, settings } = useOps();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/orders?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    triggerRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        type: "info",
        title: "Operations Telemetry Synced",
        message: "Refreshed operational KPIs, pending orders, and alerts.",
        duration: 2500,
      });
    }, 400);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle & brand on small screens */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Enterprise Hub
          </span>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-medium text-slate-600">{settings.companyName}</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, SKUs (e.g., ORD-7025)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh button */}
        <button
          type="button"
          onClick={handleManualRefresh}
          aria-label="Refresh dashboard data"
          title="Refresh operational metrics"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
        </button>

        {/* Notifications Icon with Badge */}
        <Link
          href="/alerts"
          aria-label={`View ${unreadAlertsCount} unread alerts`}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          )}
        </Link>

        {/* Profile Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            AS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{settings.fullName}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">{settings.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

