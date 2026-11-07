"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOps } from "@/context/OpsContext";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Users,
  Bell,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { unreadAlertsCount } = useOps();

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Customers", href: "/customers", icon: Users },
    {
      label: "Alerts & Notifications",
      href: "/alerts",
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    { label: "Reports", href: "/reports", icon: FileSpreadsheet },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        aria-label="Main Navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Ops<span className="text-brand-400">View</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Executive Portal
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Operations Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive
                        ? "bg-white text-brand-700"
                        : "bg-rose-500/90 text-white animate-pulse"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / status pill at bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-700/80 text-brand-100 flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Aarav Sharma</p>
              <p className="text-[11px] text-slate-400 truncate">VP of Operations</p>
            </div>
            <Link
              href="/settings"
              aria-label="Account Settings"
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

