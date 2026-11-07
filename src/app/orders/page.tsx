"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types";
import { fetchOrders } from "@/lib/api";
import { useOps } from "@/context/OpsContext";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "All";

  const { dataVersion } = useOps();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customerName" | "id">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync if URL query changes
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearch(q);
    const s = searchParams.get("status");
    if (s !== null) setStatus(s);
  }, [searchParams]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchOrders({
        search,
        status,
        paymentStatus,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      setOrders(result.orders);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error("Orders load failed:", err);
      setError(err?.message || "Failed to load orders ledger.");
    } finally {
      setLoading(false);
    }
  }, [search, status, paymentStatus, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, dataVersion]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setPaymentStatus("All");
    setSortBy("date");
    setSortOrder("desc");
    setPage(1);
  };

  const handleSortChange = (field: any) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Order Management & Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Execute status transitions, inspect payment authorizations, and manage client dispatches
        </p>
      </div>

      {/* Filter Bar */}
      <OrderFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        onReset={handleResetFilters}
      />

      {error && <ErrorState message={error} onRetry={loadOrders} />}

      {/* Table & Pagination */}
      {loading ? (
        <TableSkeleton rows={pageSize} cols={8} />
      ) : (
        <OrdersTable
          orders={orders}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRefreshOrders={loadOrders}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} cols={8} />}>
      <OrdersPageContent />
    </Suspense>
  );
}

