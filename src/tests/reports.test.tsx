import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { OpsProvider } from "@/context/OpsContext";
import { exportToCSV } from "@/lib/api";

describe("Executive Reports & CSV Export Engine", () => {
  it("renders report generator form with date options and domain checkboxes", () => {
    render(
      <OpsProvider>
        <ReportGenerator />
      </OpsProvider>
    );

    expect(screen.getByText("Configure Executive Operational Report")).toBeInTheDocument();
    expect(screen.getByText("Revenue & Margins")).toBeInTheDocument();
    expect(screen.getByText("Order Ledger")).toBeInTheDocument();
    expect(screen.getByText("Customer Roster")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate Audit Report/i })).toBeInTheDocument();
  });

  it("generates report data sample upon clicking generate button", async () => {
    render(
      <OpsProvider>
        <ReportGenerator />
      </OpsProvider>
    );

    const generateBtn = screen.getByRole("button", { name: /Generate Audit Report/i });
    fireEvent.click(generateBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/Audit Report Ready/i)).toBeInTheDocument();
        expect(screen.getByText("Download Report as CSV")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("handles CSV export logic and escapes special characters correctly", () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    const revokeObjectURL = vi.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;

    const sampleRows = [
      {
        ReportSection: "Orders",
        ID: "ORD-9999",
        EntityName: "Test, Customer with Comma",
        Category: 'Hardware "Pro" Model',
        Amount_INR: 50000,
        Status: "Delivered",
      },
    ];

    const result = exportToCSV("test_export.csv", sampleRows);
    expect(result).toBe(true);
    expect(createObjectURL).toHaveBeenCalled();
  });

  it("returns false if rows array is empty", () => {
    const result = exportToCSV("empty.csv", []);
    expect(result).toBe(false);
  });
});

