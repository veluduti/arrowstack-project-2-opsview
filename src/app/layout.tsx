import type { Metadata } from "next";
import "./globals.css";
import { OpsProvider } from "@/context/OpsContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "OpsView – Executive Operations Dashboard",
  description: "Executive Operations Dashboard for Monitoring Business Performance, Order Pipelines, and Operational Bottlenecks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <OpsProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </OpsProvider>
      </body>
    </html>
  );
}

