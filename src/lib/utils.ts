import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers into currency representation.
 * Defaults to Indian Rupee (₹) as requested by project requirements (e.g. ₹5,00,000).
 */
export function formatCurrency(
  amount: number,
  currency: "INR" | "USD" | "EUR" | "GBP" = "INR",
  compact: boolean = false
): string {
  if (isNaN(amount)) return "₹0";

  if (currency === "INR") {
    if (compact && Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (compact && Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (compact && Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }

    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      notation: compact ? "compact" : "standard",
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDate(dateString: string, includeTime: boolean = false): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (includeTime) {
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return Number(change.toFixed(1));
}

// In-memory fallback if LocalStorage fails or is disabled (e.g., incognito or security restrictions)
const memoryStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return memoryStorage[key] ? JSON.parse(memoryStorage[key]) : defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`LocalStorage read error for key "${key}", falling back to memory/default`, e);
      try {
        if (memoryStorage[key]) return JSON.parse(memoryStorage[key]);
      } catch {}
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    const serialized = JSON.stringify(value);
    memoryStorage[key] = serialized;

    if (typeof window === "undefined") return true;
    try {
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (e) {
      console.warn(`LocalStorage write error for key "${key}". Used memory fallback.`, e);
      return false;
    }
  },

  removeItem(key: string): void {
    delete memoryStorage[key];
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`LocalStorage remove error for key "${key}"`, e);
    }
  },
};

