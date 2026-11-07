import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertItem } from "@/components/alerts/AlertItem";
import { AlertFilters } from "@/components/alerts/AlertFilters";
import { OperationalAlert } from "@/types";
import { fetchAlerts, markAlertAsRead, dismissAlert } from "@/lib/api";

describe("Alerts & Notification Triage System", () => {
  const sampleAlert: OperationalAlert = {
    id: "ALT-TEST-001",
    title: "5 Enterprise Orders Awaiting Verification > 24 Hours",
    message: "Pending orders exceed the standard processing SLA.",
    category: "pending_order",
    severity: "critical",
    timestamp: new Date().toISOString(),
    isRead: false,
    isDismissed: false,
    actionUrl: "/orders?status=Processing",
    actionLabel: "Review Pending Orders",
  };

  it("renders alert with critical badge, category, and action link", () => {
    const handleRead = vi.fn();
    const handleDismiss = vi.fn();

    render(
      <AlertItem
        alert={sampleAlert}
        onMarkRead={handleRead}
        onDismiss={handleDismiss}
      />
    );

    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("Pending Order SLA")).toBeInTheDocument();
    expect(screen.getByText(sampleAlert.title)).toBeInTheDocument();
    expect(screen.getByText("Review Pending Orders")).toBeInTheDocument();

    const markReadBtn = screen.getByRole("button", { name: /Mark as Read/i });
    fireEvent.click(markReadBtn);
    expect(handleRead).toHaveBeenCalledWith("ALT-TEST-001");

    const dismissBtn = screen.getByRole("button", { name: /Dismiss/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledWith("ALT-TEST-001");
  });

  it("filters alerts by category and severity using API", async () => {
    const criticalAlerts = await fetchAlerts({ severity: "critical" });
    criticalAlerts.forEach((a) => {
      expect(a.severity).toBe("critical");
    });

    const pendingOrderAlerts = await fetchAlerts({ category: "pending_order" });
    pendingOrderAlerts.forEach((a) => {
      expect(a.category).toBe("pending_order");
    });
  });

  it("marks alert as read and dismisses alert properly", async () => {
    await markAlertAsRead("ALT-001");
    const alertsAfterRead = await fetchAlerts();
    const target = alertsAfterRead.find((a) => a.id === "ALT-001");
    expect(target?.isRead).toBe(true);

    await dismissAlert("ALT-001");
    const alertsAfterDismiss = await fetchAlerts();
    const dismissedTarget = alertsAfterDismiss.find((a) => a.id === "ALT-001");
    expect(dismissedTarget).toBeUndefined(); // Dismissed alerts are filtered from active feed
  });
});

