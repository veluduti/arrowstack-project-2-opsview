import {
  MetricCardData,
  Order,
  Customer,
  OperationalAlert,
  RevenueDataPoint,
  CategorySalesData,
  StatusDistribution,
  FulfillmentStatus,
  PaymentStatus,
  ReportFilter,
  CustomerGrowthDataPoint,
} from "@/types";
import {
  INITIAL_METRICS,
  INITIAL_MONTHLY_REVENUE,
  INITIAL_WEEKLY_REVENUE,
  INITIAL_DAILY_REVENUE,
  INITIAL_CATEGORY_SALES,
  INITIAL_STATUS_DISTRIBUTION,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_ALERTS,
  INITIAL_CUSTOMER_GROWTH,
} from "./mockData";
import { safeLocalStorage } from "./utils";

const STORAGE_KEYS = {
  ORDERS: "opsview_orders_v1",
  CUSTOMERS: "opsview_customers_v1",
  ALERTS: "opsview_alerts_v1",
  METRICS: "opsview_metrics_v1",
  SIMULATE_ERROR: "opsview_sim_error",
};

// Artificial network latency simulation (50-200ms) to ensure true async behavior
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Check if error simulation is triggered
function checkSimulatedError() {
  if (typeof window !== "undefined" && window.sessionStorage?.getItem("opsview_simulate_error") === "true") {
    throw new ApiError("Simulated Network/Server Disruption. Please try again.", 503);
  }
}

/**
 * Get stored orders or initialize with mock dataset
 */
export function getStoredOrders(): Order[] {
  return safeLocalStorage.getItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

/**
 * Get stored customers or initialize with mock dataset
 */
export function getStoredCustomers(): Customer[] {
  return safeLocalStorage.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
}

/**
 * Get stored alerts or initialize with mock dataset
 */
export function getStoredAlerts(): OperationalAlert[] {
  return safeLocalStorage.getItem<OperationalAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
}

/**
 * Fetch KPI metrics
 */
export async function fetchOverviewMetrics(): Promise<MetricCardData[]> {
  await delay(120);
  checkSimulatedError();

  const orders = getStoredOrders();
  const customers = getStoredCustomers();

  // Dynamically compute KPIs to keep them 100% synchronized with modified state
  const totalRev = orders.reduce((sum, o) => (o.paymentStatus === "Paid" ? sum + o.amount : sum), 0);
  const totalOrdersCount = orders.length;
  const activeCustomersCount = customers.filter((c) => c.status === "Active").length;
  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === "Processing").length;

  return [
    {
      id: "metric-revenue",
      title: "Total Revenue",
      value: totalRev,
      formattedValue: `₹${totalRev.toLocaleString("en-IN")}`,
      previousValue: 435000,
      changePercentage: Number((((totalRev - 435000) / 435000) * 100).toFixed(1)),
      trend: totalRev >= 435000 ? "positive" : "negative",
      icon: "TrendingUp",
      description: "vs. ₹4,35,000 last month",
      timeframe: "Current Month",
    },
    {
      id: "metric-orders",
      title: "Total Orders",
      value: totalOrdersCount,
      formattedValue: String(totalOrdersCount),
      previousValue: 220,
      changePercentage: Number((((totalOrdersCount - 220) / 220) * 100).toFixed(1)),
      trend: totalOrdersCount >= 220 ? "positive" : "negative",
      icon: "ShoppingBag",
      description: "vs. 220 orders last month",
      timeframe: "Current Month",
    },
    {
      id: "metric-customers",
      title: "Active Customers",
      value: activeCustomersCount,
      formattedValue: String(activeCustomersCount),
      previousValue: 165,
      changePercentage: Number((((activeCustomersCount - 165) / 165) * 100).toFixed(1)),
      trend: activeCustomersCount >= 165 ? "positive" : "negative",
      icon: "Users",
      description: "vs. 165 active last month",
      timeframe: "Current Month",
    },
    {
      id: "metric-pending",
      title: "Pending Orders",
      value: pendingOrdersCount,
      formattedValue: String(pendingOrdersCount),
      previousValue: 32,
      changePercentage: Number((((pendingOrdersCount - 32) / 32) * 100).toFixed(1)),
      trend: pendingOrdersCount <= 32 ? "positive" : "negative",
      icon: "Clock",
      description: `${pendingOrdersCount} orders currently in processing`,
      timeframe: "Awaiting Action",
    },
  ];
}

/**
 * Fetch revenue trend data by granularity
 */
export async function fetchRevenueTrends(
  granularity: "monthly" | "weekly" | "daily" = "monthly"
): Promise<RevenueDataPoint[]> {
  await delay(100);
  checkSimulatedError();

  switch (granularity) {
    case "weekly":
      return INITIAL_WEEKLY_REVENUE;
    case "daily":
      return INITIAL_DAILY_REVENUE;
    case "monthly":
    default:
      return INITIAL_MONTHLY_REVENUE;
  }
}

/**
 * Fetch Category Sales Breakdown
 */
export async function fetchCategorySales(): Promise<CategorySalesData[]> {
  await delay(90);
  checkSimulatedError();
  return INITIAL_CATEGORY_SALES;
}

/**
 * Fetch Order Status Distribution
 */
export async function fetchStatusDistribution(): Promise<StatusDistribution[]> {
  await delay(90);
  checkSimulatedError();
  const orders = getStoredOrders();

  const counts: Record<string, number> = {
    Delivered: 0,
    Shipped: 0,
    Processing: 0,
    "On Hold": 0,
    Cancelled: 0,
  };

  orders.forEach((o) => {
    if (counts[o.fulfillmentStatus] !== undefined) {
      counts[o.fulfillmentStatus]++;
    } else {
      counts[o.fulfillmentStatus] = 1;
    }
  });

  const total = orders.length || 1;
  const colors: Record<string, string> = {
    Delivered: "#10b981",
    Shipped: "#0c8de9",
    Processing: "#f59e0b",
    "On Hold": "#8b5cf6",
    Cancelled: "#ef4444",
  };

  return Object.keys(counts).map((status) => ({
    status,
    count: counts[status],
    percentage: Number(((counts[status] / total) * 100).toFixed(1)),
    color: colors[status] || "#64748b",
  }));
}

/**
 * Fetch Customer Growth analytics
 */
export async function fetchCustomerGrowth(): Promise<CustomerGrowthDataPoint[]> {
  await delay(100);
  checkSimulatedError();
  return INITIAL_CUSTOMER_GROWTH;
}

/**
 * Fetch orders with search, filters, sorting, and pagination
 */
export interface FetchOrdersParams {
  search?: string;
  status?: string;
  paymentStatus?: string;
  sortBy?: "date" | "amount" | "customerName" | "id";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export interface FetchOrdersResult {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchOrders(params: FetchOrdersParams = {}): Promise<FetchOrdersResult> {
  await delay(120);
  checkSimulatedError();

  const {
    search = "",
    status = "All",
    paymentStatus = "All",
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
    startDate,
    endDate,
  } = params;

  let list = [...getStoredOrders()];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.productSummary.toLowerCase().includes(q) ||
        o.shippingAddress.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (status && status !== "All") {
    list = list.filter((o) => o.fulfillmentStatus.toLowerCase() === status.toLowerCase());
  }

  // Payment Status filter
  if (paymentStatus && paymentStatus !== "All") {
    list = list.filter((o) => o.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
  }

  // Date range filter
  if (startDate) {
    const start = new Date(startDate).getTime();
    list = list.filter((o) => new Date(o.date).getTime() >= start);
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    list = list.filter((o) => new Date(o.date).getTime() <= end);
  }

  // Sorting
  list.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "amount") {
      comparison = a.amount - b.amount;
    } else if (sortBy === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortBy === "id") {
      comparison = a.id.localeCompare(b.id);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedOrders = list.slice(startIndex, startIndex + pageSize);

  return {
    orders: paginatedOrders,
    total,
    page: validPage,
    pageSize,
    totalPages,
  };
}

/**
 * Update an order's status and persist
 */
export async function updateOrderStatus(
  orderId: string,
  updates: {
    fulfillmentStatus?: FulfillmentStatus;
    paymentStatus?: PaymentStatus;
    notes?: string;
  }
): Promise<Order> {
  await delay(150);
  checkSimulatedError();

  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) {
    throw new ApiError(`Order ${orderId} not found.`, 404);
  }

  const updatedOrder: Order = {
    ...orders[index],
    ...(updates.fulfillmentStatus && { fulfillmentStatus: updates.fulfillmentStatus }),
    ...(updates.paymentStatus && { paymentStatus: updates.paymentStatus }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
  };

  orders[index] = updatedOrder;
  safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, orders);

  return updatedOrder;
}

/**
 * Fetch customers with search, filter, pagination
 */
export interface FetchCustomersParams {
  search?: string;
  type?: string;
  status?: string;
  sortBy?: "name" | "totalSpent" | "totalOrders" | "joinedDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface FetchCustomersResult {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchCustomers(params: FetchCustomersParams = {}): Promise<FetchCustomersResult> {
  await delay(110);
  checkSimulatedError();

  const {
    search = "",
    type = "All",
    status = "All",
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 8,
  } = params;

  let list = [...getStoredCustomers()];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        c.location.toLowerCase().includes(q)
    );
  }

  if (type && type !== "All") {
    list = list.filter((c) => c.type.toLowerCase() === type.toLowerCase());
  }

  if (status && status !== "All") {
    list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase());
  }

  list.sort((a, b) => {
    let comp = 0;
    if (sortBy === "name") {
      comp = a.name.localeCompare(b.name);
    } else if (sortBy === "totalSpent") {
      comp = a.totalSpent - b.totalSpent;
    } else if (sortBy === "totalOrders") {
      comp = a.totalOrders - b.totalOrders;
    } else if (sortBy === "joinedDate") {
      comp = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
    }
    return sortOrder === "asc" ? comp : -comp;
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedCustomers = list.slice(startIndex, startIndex + pageSize);

  return {
    customers: paginatedCustomers,
    total,
    page: validPage,
    pageSize,
    totalPages,
  };
}

/**
 * Fetch alerts with filtering
 */
export async function fetchAlerts(params: {
  category?: string;
  severity?: string;
  unreadOnly?: boolean;
} = {}): Promise<OperationalAlert[]> {
  await delay(80);
  checkSimulatedError();

  let alerts = getStoredAlerts().filter((a) => !a.isDismissed);

  if (params.category && params.category !== "all") {
    alerts = alerts.filter((a) => a.category === params.category);
  }

  if (params.severity && params.severity !== "all") {
    alerts = alerts.filter((a) => a.severity === params.severity);
  }

  if (params.unreadOnly) {
    alerts = alerts.filter((a) => !a.isRead);
  }

  return alerts;
}

/**
 * Mark an alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<void> {
  await delay(80);
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
  safeLocalStorage.setItem(STORAGE_KEYS.ALERTS, updated);
}

/**
 * Mark all alerts as read
 */
export async function markAllAlertsAsRead(): Promise<void> {
  await delay(80);
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => ({ ...a, isRead: true }));
  safeLocalStorage.setItem(STORAGE_KEYS.ALERTS, updated);
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string): Promise<void> {
  await delay(80);
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => (a.id === alertId ? { ...a, isDismissed: true } : a));
  safeLocalStorage.setItem(STORAGE_KEYS.ALERTS, updated);
}

/**
 * Reset mock data to factory state
 */
export function resetMockData(): void {
  safeLocalStorage.removeItem(STORAGE_KEYS.ORDERS);
  safeLocalStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
  safeLocalStorage.removeItem(STORAGE_KEYS.ALERTS);
  safeLocalStorage.removeItem(STORAGE_KEYS.METRICS);
}

/**
 * Export arbitrary data rows to CSV download
 */
export function exportToCSV(filename: string, rows: Record<string, unknown>[]): boolean {
  if (!rows || !rows.length) {
    return false;
  }

  try {
    const separator = ",";
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      "\n" +
      rows
        .map((row) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : String(row[k]);
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator)
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("CSV Export failed:", err);
    return false;
  }
}

