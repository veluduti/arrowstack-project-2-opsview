"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserSettings, DateRangePreset, OperationalAlert } from "@/types";
import { INITIAL_USER_SETTINGS } from "@/lib/mockData";
import { safeLocalStorage } from "@/lib/utils";
import { getStoredAlerts, resetMockData } from "@/lib/api";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface OpsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  dateRange: DateRangePreset;
  setDateRange: (range: DateRangePreset) => void;
  unreadAlertsCount: number;
  refreshUnreadCount: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  confirmDialog: ConfirmDialogOptions | null;
  requestConfirm: (options: ConfirmDialogOptions) => void;
  closeConfirm: () => void;
  dataVersion: number;
  triggerRefresh: () => void;
  resetAllDemoData: () => void;
  isSimulatingError: boolean;
  toggleSimulateError: () => void;
}

const OpsContext = createContext<OpsContextType | undefined>(undefined);

const SETTINGS_KEY = "opsview_user_settings_v1";

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(INITIAL_USER_SETTINGS);
  const [dateRange, setDateRange] = useState<DateRangePreset>("30d");
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);
  const [dataVersion, setDataVersion] = useState<number>(1);
  const [isSimulatingError, setIsSimulatingError] = useState<boolean>(false);

  // Initialize settings from localStorage
  useEffect(() => {
    const saved = safeLocalStorage.getItem<UserSettings>(SETTINGS_KEY, INITIAL_USER_SETTINGS);
    setSettings(saved);

    if (typeof window !== "undefined") {
      const sim = window.sessionStorage?.getItem("opsview_simulate_error") === "true";
      setIsSimulatingError(sim);
    }
  }, []);

  const refreshUnreadCount = useCallback(() => {
    const alerts = getStoredAlerts();
    const count = alerts.filter((a) => !a.isDismissed && !a.isRead).length;
    setUnreadAlertsCount(count);
  }, []);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount, dataVersion]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      safeLocalStorage.setItem(SETTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestConfirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const triggerRefresh = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  const resetAllDemoData = useCallback(() => {
    resetMockData();
    triggerRefresh();
    addToast({
      type: "success",
      title: "Data Reset Complete",
      message: "Restored all orders, alerts, and customer records to factory defaults.",
    });
  }, [triggerRefresh, addToast]);

  const toggleSimulateError = useCallback(() => {
    const nextState = !isSimulatingError;
    setIsSimulatingError(nextState);
    if (typeof window !== "undefined") {
      window.sessionStorage?.setItem("opsview_simulate_error", String(nextState));
    }
    triggerRefresh();
    addToast({
      type: nextState ? "warning" : "info",
      title: nextState ? "Simulated API Error Mode ENABLED" : "Simulated API Error Mode DISABLED",
      message: nextState
        ? "Mock API will now throw 503 Server Errors to test UI error boundaries."
        : "Normal API operations resumed.",
    });
  }, [isSimulatingError, triggerRefresh, addToast]);

  return (
    <OpsContext.Provider
      value={{
        settings,
        updateSettings,
        dateRange,
        setDateRange,
        unreadAlertsCount,
        refreshUnreadCount,
        toasts,
        addToast,
        removeToast,
        confirmDialog,
        requestConfirm,
        closeConfirm,
        dataVersion,
        triggerRefresh,
        resetAllDemoData,
        isSimulatingError,
        toggleSimulateError,
      }}
    >
      {children}
    </OpsContext.Provider>
  );
}

export function useOps() {
  const context = useContext(OpsContext);
  if (!context) {
    throw new Error("useOps must be used within an OpsProvider");
  }
  return context;
}

