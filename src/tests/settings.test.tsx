import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { OpsProvider } from "@/context/OpsContext";

describe("Executive Settings Form and Zod Validation", () => {
  it("renders settings fields with preloaded executive preferences", () => {
    render(
      <OpsProvider>
        <SettingsForm />
      </OpsProvider>
    );

    expect(screen.getByText("Executive Identity & Organization")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Aarav Sharma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("aarav.sharma@opsview.enterprise.io")).toBeInTheDocument();
    expect(screen.getByDisplayValue("VP of Operations")).toBeInTheDocument();
  });

  it("triggers validation errors when fields are invalid", async () => {
    render(
      <OpsProvider>
        <SettingsForm />
      </OpsProvider>
    );

    const emailInput = screen.getByDisplayValue("aarav.sharma@opsview.enterprise.io");
    fireEvent.change(emailInput, { target: { value: "invalid-email-string" } });

    const submitBtn = screen.getByRole("button", { name: /Save Preferences/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid business email address/i)).toBeInTheDocument();
    });
  });

  it("submits successfully with valid inputs and persists settings", async () => {
    render(
      <OpsProvider>
        <SettingsForm />
      </OpsProvider>
    );

    const nameInput = screen.getByDisplayValue("Aarav Sharma");
    fireEvent.change(nameInput, { target: { value: "Aarav Sharma Updated" } });

    const submitBtn = screen.getByRole("button", { name: /Save Preferences/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aarav Sharma Updated")).toBeInTheDocument();
    });
  });
});

