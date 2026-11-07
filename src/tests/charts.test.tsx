import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { CategorySalesChart } from "@/components/dashboard/CategorySalesChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { INITIAL_MONTHLY_REVENUE, INITIAL_CATEGORY_SALES, INITIAL_STATUS_DISTRIBUTION } from "@/lib/mockData";

describe("Chart Visualization Components", () => {
  it("renders RevenueTrendChart with title, target variance and switches view modes", () => {
    render(<RevenueTrendChart data={INITIAL_MONTHLY_REVENUE} />);
    expect(screen.getByText("Revenue & Operational Trajectory")).toBeInTheDocument();
    expect(screen.getByText(/14.9% YoY/)).toBeInTheDocument();

    const revenueBtn = screen.getByRole("button", { name: "Revenue" });
    const ordersBtn = screen.getByRole("button", { name: "Orders" });
    const combinedBtn = screen.getByRole("button", { name: "Combined" });

    expect(revenueBtn).toBeInTheDocument();
    expect(ordersBtn).toBeInTheDocument();
    expect(combinedBtn).toBeInTheDocument();

    // Toggle view to orders
    fireEvent.click(ordersBtn);
    expect(ordersBtn.className).toContain("text-brand-700");

    // Toggle view to combined
    fireEvent.click(combinedBtn);
    expect(combinedBtn.className).toContain("text-brand-700");
  });

  it("renders CategorySalesChart with 5 industry verticals and breakdown shares", () => {
    render(<CategorySalesChart data={INITIAL_CATEGORY_SALES} />);
    expect(screen.getByText("Revenue by Vertical")).toBeInTheDocument();
    expect(screen.getByText("Cloud Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Software Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Consulting")).toBeInTheDocument();
  });

  it("renders StatusDistributionChart showing 250 orders pipeline breakdown", () => {
    render(<StatusDistributionChart data={INITIAL_STATUS_DISTRIBUTION} />);
    expect(screen.getByText("Fulfillment Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("On Hold")).toBeInTheDocument();
  });
});

