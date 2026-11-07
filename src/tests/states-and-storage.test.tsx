import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { safeLocalStorage } from "@/lib/utils";

describe("Required UI States & LocalStorage Resilience", () => {
  it("renders loading skeletons properly without crashing", () => {
    const { container: c1 } = render(<MetricCardSkeleton />);
    expect(c1.querySelector(".animate-pulse")).toBeInTheDocument();

    const { container: c2 } = render(<ChartSkeleton height="h-64" />);
    expect(c2.querySelector(".animate-pulse")).toBeInTheDocument();

    const { container: c3 } = render(<TableSkeleton rows={3} cols={4} />);
    expect(c3.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders informative empty states with custom actions", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Zero records found"
        description="Try adjusting your filter date range or query terms."
        actionLabel="Reset Current Filter"
        onAction={handleAction}
      />
    );

    expect(screen.getByText("Zero records found")).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your filter/)).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /Reset Current Filter/i });
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalled();
  });

  it("renders friendly error state with retry callback", () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Simulated Network Interruption"
        message="A temporary 503 error occurred while fetching orders."
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText("Simulated Network Interruption")).toBeInTheDocument();
    expect(screen.getByText(/temporary 503 error/)).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Retry Operation/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalled();
  });

  describe("safeLocalStorage failure handling", () => {
    it("handles corrupted JSON stored in localStorage gracefully", () => {
      window.localStorage.setItem("corrupted_key", "{malformed_json_not_valid");
      const result = safeLocalStorage.getItem("corrupted_key", { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it("falls back to memory store if localStorage.setItem throws (QuotaExceeded / SecurityError)", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError: storage limit reached");
      });

      const writeSuccess = safeLocalStorage.setItem("test_key", { value: 123 });
      expect(writeSuccess).toBe(false);

      // Verify that getItem can still retrieve the value from the in-memory fallback!
      const retrieved = safeLocalStorage.getItem("test_key", { value: 0 });
      expect(retrieved).toEqual({ value: 123 });

      setItemSpy.mockRestore();
    });

    it("falls back to memory store if localStorage.getItem throws SecurityError", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError: Access is denied for this document");
      });

      safeLocalStorage.setItem("secure_key", "secret_value");
      const result = safeLocalStorage.getItem("secure_key", "default_val");
      expect(result).toBe("secret_value");

      getItemSpy.mockRestore();
    });
  });
});
