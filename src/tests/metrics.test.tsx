import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricCardData } from "@/types";
import { formatCurrency, formatNumber, calculatePercentageChange } from "@/lib/utils";

describe("MetricCard Component and Utility Calculations", () => {
  const sampleMetric: MetricCardData = {
    id: "metric-revenue",
    title: "Total Revenue",
    value: 500000,
    formattedValue: "₹5,00,000",
    previousValue: 435000,
    changePercentage: 14.9,
    trend: "positive",
    icon: "TrendingUp",
    description: "vs. ₹4,35,000 last month",
    timeframe: "Current Month",
  };

  it("renders metric title, current value and description accurately", () => {
    render(<MetricCard metric={sampleMetric} />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("₹5,00,000")).toBeInTheDocument();
    expect(screen.getByText("vs. ₹4,35,000 last month")).toBeInTheDocument();
    expect(screen.getByText(/14.9%/)).toBeInTheDocument();
  });

  it("correctly calculates percentage changes between operational periods", () => {
    const change = calculatePercentageChange(500000, 435000);
    expect(change).toBe(14.9);

    const drop = calculatePercentageChange(25, 32);
    expect(drop).toBe(-21.9);

    const zeroBaseline = calculatePercentageChange(100, 0);
    expect(zeroBaseline).toBe(100);
  });

  it("formats Indian Rupees currency properly with commas and symbol", () => {
    expect(formatCurrency(500000, "INR")).toMatch(/₹\s*5,00,000/);
    expect(formatCurrency(49000, "INR")).toMatch(/₹\s*49,000/);
    expect(formatCurrency(500000, "INR", true)).toBe("₹5.00 L");
  });

  it("renders negative trend indicators appropriately", () => {
    const negativeMetric: MetricCardData = {
      ...sampleMetric,
      id: "metric-negative",
      title: "Delayed Orders",
      value: 12,
      formattedValue: "12",
      changePercentage: -15.4,
      trend: "negative",
    };
    render(<MetricCard metric={negativeMetric} />);
    expect(screen.getByText("Delayed Orders")).toBeInTheDocument();
    expect(screen.getByText(/15.4%/)).toBeInTheDocument();
  });
});

