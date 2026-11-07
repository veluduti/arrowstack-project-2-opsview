# OpsView – Executive Operations Dashboard: Implementation Architecture

## 1. Architectural Overview

OpsView is structured as an enterprise-grade client-side Next.js App Router application with strict separation between:
1. **Types and Data Contracts** (`src/types/index.ts`)
2. **Centralized Data & Simulated REST API Layer** (`src/lib/mockData.ts`, `src/lib/api.ts`)
3. **Resilient Utilities & Safe Storage Adapters** (`src/lib/utils.ts`)
4. **Global Operational State & Toast/Dialog Context** (`src/context/OpsContext.tsx`)
5. **Atomic Reusable UI Components** (`src/components/`)
6. **Page Views & Routed Views** (`src/app/`)

```
OpsView Architecture:
┌────────────────────────────────────────────────────────┐
│                   App Router Pages                     │
│  (/, /analytics, /orders, /customers, /alerts, ...)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│         Dashboard Layout & Navigation Shell            │
│  (Sidebar, TopNavbar, DemoBanner, Toast, Modal Manager)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             OpsContext Global Store                    │
│  - User Settings & Localization                        │
│  - Unread Alert Counter                                │
│  - Dynamic Refresh Trigger & Versioning                │
│  - 503 Server Error Boundary Simulator                │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│            Simulated REST API Layer                    │
│  - Latency Injection (80-150ms)                        │
│  - In-Memory / LocalStorage Persistence                │
│  - Filter, Sort, Pagination & Mutation Engine          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Centralized Mock Data & Asynchronous Business Logic

### 2.1 Baseline Dataset Metrics
- Initial Revenue: **₹5,00,000**
- Initial Orders: **250**
- Active Customers: **180**
- Pending Orders: **25** (Processing queue)
- Vertical breakdown:
  - Cloud Infrastructure: ₹1,75,000 (35%, 82 orders)
  - Software Subscriptions: ₹1,40,000 (28%, 74 orders)
  - Enterprise Consulting: ₹1,05,000 (21%, 48 orders)
  - Hardware & Edge IoT: ₹50,000 (10%, 28 orders)
  - SLA Support & Maintenance: ₹30,000 (6%, 18 orders)
  - **Total Sum**: exactly ₹5,00,000 and 250 orders.

### 2.2 Simulated Async REST API
Located in `src/lib/api.ts`:
- Emulates asynchronous delay using micro-promises (`delay(80-150ms)`).
- Dynamically recalculates KPI cards directly from the orders ledger so any modified order immediately updates the top-level revenue, order count, and backlog statistics in real time.
- Implements error simulation trigger `checkSimulatedError()` to verify UI error boundaries and retry logic.

---

## 3. Resilient LocalStorage & Fault-Tolerant Storage Adapter

Located in `src/lib/utils.ts`:
- Browsers operating under incognito mode, strict security sandboxes, or quota exhaustion can throw errors on `localStorage.setItem` or `localStorage.getItem`.
- OpsView implements `safeLocalStorage` wrapping all storage operations in a `try...catch` block backed by an in-memory dictionary fallback.
- Corrupted JSON records in storage are gracefully parsed with default fallbacks rather than throwing unhandled runtime exceptions.

---

## 4. UI Component Hierarchy & Design Patterns

### 4.1 Component Modularity
- `MetricCard`: Reusable KPI tile displaying title, formatted figure, delta badge, trend arrow, comparison description, and icon.
- `RevenueTrendChart`: Responsive Recharts Area chart supporting multi-view toggles (`Revenue`, `Orders`, `Combined`), custom currency tooltips, and screen-reader accessibility tables.
- `CategorySalesChart`: Horizontal bar chart illustrating revenue distribution and proportional market share.
- `StatusDistributionChart`: Donut visualization with centered metric overlay and legend tags.
- `OrdersTable` & `OrderFilters`: Decoupled filter toolbar and responsive data table with interactive column header sorting, multi-criteria filters, and pagination controls.
- `OrderDetailsModal`: Multi-pane modal providing order inspection, itemized receipts, customer delivery address, and active status mutation forms.
- `ReportGenerator`: Configuration suite for compiling and generating formatted CSV files.
- `SettingsForm`: Form state managed through `react-hook-form` paired with strict `zod` schema resolvers.

---

## 5. UI States & Edge-Case Engineering

1. **Loading State**: Customized skeleton placeholders matching the exact dimensions of KPI cards, charts, and tables to eliminate layout shifts.
2. **Empty State**: Friendly visual illustration, helpful explanation, and contextual "Clear Filters" action buttons.
3. **Error State**: Non-blocking error notices with retry handlers and simulated failure testing toggle.
4. **Success State**: Non-intrusive floating toasts that auto-dismiss after 4 seconds and modal confirmations for destructive actions.

