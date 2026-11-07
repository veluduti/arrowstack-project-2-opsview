export type TrendDirection = "positive" | "negative" | "neutral";

export interface MetricCardData {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  previousValue: number;
  changePercentage: number;
  trend: TrendDirection;
  icon: string;
  description: string;
  timeframe: string;
}

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
export type FulfillmentStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled" | "On Hold";

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  date: string; // ISO date string
  items: OrderItem[];
  productSummary: string;
  amount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: string;
  priority: "High" | "Medium" | "Low";
  trackingNumber?: string;
  notes?: string;
}

export type CustomerType = "New" | "Returning" | "VIP";
export type CustomerStatus = "Active" | "Inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: CustomerType;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  joinedDate: string;
  location: string;
  notes?: string;
}

export type AlertCategory =
  | "pending_order"
  | "low_stock"
  | "payment_failure"
  | "delayed_fulfillment"
  | "system";

export type AlertSeverity = "critical" | "warning" | "info";

export interface OperationalAlert {
  id: string;
  title: string;
  message: string;
  category: AlertCategory;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  isDismissed: boolean;
  referenceId?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  target: number;
  orders: number;
  expenses: number;
  netMargin: number;
}

export interface CategorySalesData {
  category: string;
  revenue: number;
  percentage: number;
  orders: number;
  growth: number;
  color: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CustomerGrowthDataPoint {
  period: string;
  newCustomers: number;
  returningCustomers: number;
  totalActive: number;
}

export type DateRangePreset = "today" | "7d" | "30d" | "90d" | "ytd" | "1y" | "custom";

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface UserSettings {
  fullName: string;
  email: string;
  role: string;
  companyName: string;
  currency: "INR" | "USD" | "EUR" | "GBP";
  refreshInterval: number; // in seconds
  emailAlerts: boolean;
  criticalAlertsPush: boolean;
  weeklyDigest: boolean;
  compactTables: boolean;
  colorTheme: "light" | "system";
}

export interface ReportFilter {
  dateRange: DateRangeFilter;
  includeRevenue: boolean;
  includeOrders: boolean;
  includeCustomers: boolean;
  includeAlerts: boolean;
  format: "csv" | "json";
}

