import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { INITIAL_ORDERS } from "@/lib/mockData";
import { OpsProvider } from "@/context/OpsContext";
import { fetchOrders, updateOrderStatus } from "@/lib/api";

describe("Orders Management & Filtering System", () => {
  it("renders orders table with columns and order rows", () => {
    const orders = INITIAL_ORDERS.slice(0, 5);
    render(
      <OpsProvider>
        <OrdersTable
          orders={orders}
          total={orders.length}
          page={1}
          pageSize={5}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          sortBy="date"
          sortOrder="desc"
          onSortChange={() => {}}
        />
      </OpsProvider>
    );

    expect(screen.getByText("ORD-7025")).toBeInTheDocument();
    expect(screen.getByText("Aditi Rao")).toBeInTheDocument();
    expect(screen.getByText("ORD-7024")).toBeInTheDocument();
  });

  it("filters orders by search query correctly using API", async () => {
    const searchRes = await fetchOrders({ search: "Aditi" });
    expect(searchRes.orders.length).toBeGreaterThanOrEqual(1);
    expect(searchRes.orders[0].customerName).toBe("Aditi Rao");

    const noMatch = await fetchOrders({ search: "NonExistentClient999" });
    expect(noMatch.orders.length).toBe(0);
    expect(noMatch.total).toBe(0);
  });

  it("filters orders by fulfillment status correctly", async () => {
    const processingOnly = await fetchOrders({ status: "Processing" });
    processingOnly.orders.forEach((o) => {
      expect(o.fulfillmentStatus).toBe("Processing");
    });

    const deliveredOnly = await fetchOrders({ status: "Delivered" });
    deliveredOnly.orders.forEach((o) => {
      expect(o.fulfillmentStatus).toBe("Delivered");
    });
  });

  it("sorts orders by amount ascending and descending", async () => {
    const desc = await fetchOrders({ sortBy: "amount", sortOrder: "desc" });
    const asc = await fetchOrders({ sortBy: "amount", sortOrder: "asc" });

    expect(desc.orders[0].amount).toBeGreaterThanOrEqual(desc.orders[desc.orders.length - 1].amount);
    expect(asc.orders[0].amount).toBeLessThanOrEqual(asc.orders[asc.orders.length - 1].amount);
  });

  it("paginates orders dataset accurately", async () => {
    const page1 = await fetchOrders({ page: 1, pageSize: 5 });
    const page2 = await fetchOrders({ page: 2, pageSize: 5 });

    expect(page1.orders.length).toBe(5);
    expect(page2.orders.length).toBe(5);
    expect(page1.orders[0].id).not.toBe(page2.orders[0].id);
  });

  it("updates order status and persists changes", async () => {
    const targetOrderId = "ORD-7025";
    const updated = await updateOrderStatus(targetOrderId, {
      fulfillmentStatus: "Delivered",
      notes: "Delivered via express dispatcher",
    });

    expect(updated.fulfillmentStatus).toBe("Delivered");
    expect(updated.notes).toBe("Delivered via express dispatcher");

    // Verify it persists in subsequent query
    const res = await fetchOrders({ search: targetOrderId });
    expect(res.orders[0].fulfillmentStatus).toBe("Delivered");
  });

  it("renders empty state in OrdersTable when no orders match", () => {
    render(
      <OpsProvider>
        <OrdersTable
          orders={[]}
          total={0}
          page={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          sortBy="date"
          sortOrder="desc"
          onSortChange={() => {}}
        />
      </OpsProvider>
    );

    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });
});

