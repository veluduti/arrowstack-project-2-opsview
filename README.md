# OpsView – Executive Operations Dashboard UI
**Arrowstack Frontend Development Internship – Project 2**

OpsView is an executive-level operations command center designed for business operations executives, VPs of Operations, and COOs. It provides unified, real-time visibility into business performance, sales trends, fulfillment bottlenecks, and customer cohort expansion.

---

## 1. Project Objective

In fast-paced logistics and multi-vertical enterprise environments, operational teams require actionable telemetry to prevent order delays, diagnose payment bottlenecks, and forecast revenue trajectory against planned baseline targets. 

OpsView solves this by centralizing:
- **Financial Velocity**: Top-line revenue and net operating margins vs. planned executive budgets.
- **Fulfillment Pipeline Health**: Active order status distributions and bottleneck diagnostics.
- **SLA & Incident Triage**: Automated alerting for pending orders exceeding the 24-hour verification window, low-stock thresholds, and payment gateway failures.
- **Customer Lifetime Cohorts**: Account retention, lifetime order volumes, and VIP client profiles.
- **Audit-Ready Reporting**: Dynamic dataset compilation and instant CSV spreadsheet downloads.

> **Demonstration Environment Disclaimer**: This application operates on an internally consistent, simulated REST demonstration dataset with simulated network latency and LocalStorage state. It does not connect to live corporate production systems.

---

## 2. Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server/Client Components, Strict TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom executive palette, typography scales, and CSS variables
- **UI Components & Icons**: [Lucide React](https://lucide.dev/) icons with custom accessible design primitives
- **Data Visualization**: [Recharts](https://recharts.org/) (Responsive Area Charts, Horizontal Bar Charts, Line Charts, Donut Visualizations)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) schemas
- **Testing Suite**: [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/) & [jsdom](https://github.com/jsdom/jsdom)
- **Persistence**: `safeLocalStorage` abstraction with in-memory dictionary fallback for sandbox & private browsing resilience

---

## 3. Application Pages & Features

### 1. Overview Dashboard (`/`)
- **4 Key Performance Indicator (KPI) Cards**:
  - **Total Revenue**: ₹5,00,000 (Target ₹4,50,000; +14.9% vs. ₹4,35,000 last month).
  - **Total Orders**: 250 orders (+13.6% vs. 220 last month).
  - **Active Customers**: 180 accounts (+9.1% active growth).
  - **Pending Orders**: 25 orders in queue (-21.9% backlog reduction).
  - Each card includes current values, previous period baseline, percentage delta badge, and trend indicator.
- **Interactive Visualizations**:
  - Revenue & Orders trajectory area chart with toggleable view modes (`Revenue`, `Orders`, `Combined`).
  - Fulfillment pipeline donut chart (Delivered 66%, Shipped 16.8%, Processing 10%, On Hold 4.4%, Cancelled 2.8%).
  - Revenue by industry vertical (Cloud Infrastructure, Software Subscriptions, Enterprise Consulting, Hardware IoT, SLA Support).
- **Recent Transactions & Alerts**:
  - Live inbound orders ledger with drawer view actions.
  - Operational bottlenecks and incident feed with quick-resolve routing.
- **Quick Date Filters**: Preset switching across `Today`, `7D`, `30D`, `90D`, `YTD`, and `1Y`.

### 2. Operations & Financial Analytics (`/analytics`)
- Dynamic granularity selector (`Monthly`, `Weekly`, `Daily`).
- Actual Revenue vs Planned Budget variance visualization.
- Operating Expenses vs Net Operating Margin contribution stack.
- Customer Cohort Acquisition & Retention line chart (Total Active, Returning Customers, New Acquisitions).
- Vertical sector profitability metrics with YoY percentage growth tags.

### 3. Orders Management & Fulfillment (`/orders`)
- Comprehensive orders table with 8 columns: Order ID, Customer Name/Email, Date, Product/Service summary, Amount (INR), Payment Status, Fulfillment Status, and Actions.
- Full-text multi-field search (Customer name, Order ID, SKU, Shipping Address).
- Dual filter dropdowns for Fulfillment Status and Payment Status.
- Multi-column sorting (Date, Amount, Customer Name, ID) with toggleable direction (Ascending / Descending).
- Responsive pagination with configurable page sizes (5, 10, 20, 50).
- Order details modal allowing status mutation (e.g., transition from `Processing` to `Delivered`) and operational notes saving.
- Friendly zero-results empty state.

### 4. Customer Accounts & Cohorts (`/customers`)
- High-level directory KPI cards: Total Directory (192), Active Customers (180), New Acquisitions (42), Returning Accounts (150).
- Cohort Growth & Retention area chart.
- Customer directory table with search, cohort type filter (`VIP`, `Returning`, `New`), and status filter (`Active`, `Inactive`).
- Customer detail modal displaying lifetime order count, aggregate spend, average order value, contact details, and account memos.

### 5. Operational Alerts & Incident Triage (`/alerts`)
- Incident feeds across categories:
  - Pending order SLA violations (> 24 hours).
  - Critical low inventory (e.g. Edge IoT Sensor Hub < 3 units).
  - Payment gateway timeouts and authorization failures.
  - Logistics courier route disruptions.
  - System maintenance and ERP ledger synchronization audits.
- Severity classification: `Critical` (Rose), `Warning` (Amber), `Info` (Blue).
- Filter by category and severity.
- Individual "Mark as Read", global "Mark All as Read", and "Dismiss" capabilities.

### 6. Executive Reports & CSV Exports (`/reports`)
- Customizable date window selection (`Today`, `7D`, `30D`, `90D`, `YTD`, `1Y`).
- Domain selection checkboxes: Revenue & Margins, Order Ledger, Customer Roster, Bottlenecks & Alerts.
- Interactive compilation with sample data preview table.
- Browser-native CSV file generation and export download.

### 7. Executive Settings & Preferences (`/settings`)
- Form validated with Zod schema and React Hook Form.
- Profile information: Full Name, Business Email, Designation, Enterprise Unit.
- Localization: Currency selection (`INR`, `USD`, `EUR`, `GBP`).
- Telemetry: Auto-refresh rate (15 to 3600 seconds) and compact table density toggle.
- Notifications: SLA push alerts, email gateway notices, weekly operational digest.
- Instant LocalStorage persistence and toast feedback.

---

## 4. Required UI States & Resilience

OpsView implements and tests all 4 fundamental UI states across every page:
1. **Loading State**: Animated skeleton placeholders matching the exact geometry of metric cards, charts, and table rows to eliminate cumulative layout shift (CLS).
2. **Empty State**: Clear informative message, contextual illustration icon, and interactive "Clear Filters" or reset action.
3. **Error State**: Friendly error notice with a direct "Retry Operation" button. Includes a toggleable **"Simulate API Error"** in the top banner to test 503 error boundaries.
4. **Success State**: Floating toast notification banners with auto-dismiss and modal confirmation dialogs for destructive actions.

---

## 5. Project Directory Structure

```
Opsview/
├── .next/                         # Compiled Next.js production build
├── node_modules/                  # Project dependencies
├── screenshots/                   # Genuine high-resolution application screenshots
│   ├── README.md                  # Viewport capture audit and details
│   ├── overview-dashboard.png     # 1440x900 Overview dashboard capture
│   ├── analytics-page.png         # 1440x900 Analytics & variance capture
│   ├── orders-page.png            # 1440x900 Orders management table capture
│   ├── customers-page.png         # 1440x900 Customer cohorts capture
│   ├── alerts-page.png            # 1440x900 Alerts triage feed capture
│   ├── reports-page.png           # 1440x900 Report generator capture
│   ├── mobile-dashboard.png       # 375x812 Mobile overview capture
│   └── mobile-orders.png          # 375x812 Mobile orders capture
├── scripts/
│   └── capture-screenshots.mjs    # Browser automation script for genuine captures
├── src/
│   ├── app/                       # Next.js App Router routes
│   │   ├── alerts/page.tsx        # Alerts & Notifications triage
│   │   ├── analytics/page.tsx     # Financial & performance analytics
│   │   ├── customers/page.tsx     # Customer directory & cohorts
│   │   ├── orders/page.tsx        # Orders management ledger
│   │   ├── reports/page.tsx       # Executive CSV report generator
│   │   ├── settings/page.tsx      # Preferences & profile configuration
│   │   ├── globals.css            # Tailwind directives & focus styles
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Overview dashboard
│   ├── components/                # Reusable UI component modules
│   │   ├── alerts/                # AlertItem, AlertFilters
│   │   ├── common/                # Skeletons, EmptyState, ErrorState, Badges, Toasts
│   │   ├── customers/             # CustomerTable, GrowthChart, CustomerDetailsModal
│   │   ├── dashboard/             # MetricCard, RevenueTrendChart, CategorySalesChart, StatusDonut
│   │   ├── layout/                # Sidebar, TopNavbar, DashboardLayout
│   │   ├── orders/                # OrdersTable, OrderFilters, OrderDetailsModal
│   │   ├── reports/               # ReportGenerator
│   │   └── settings/              # SettingsForm
│   ├── context/                   # OpsContext global store & toast/dialog manager
│   ├── lib/                       # Business logic, mock data, REST APIs, utilities
│   │   ├── api.ts                 # Simulated REST endpoints with async latency
│   │   ├── mockData.ts            # Baseline dataset (₹5,00,000, 250 orders, etc.)
│   │   └── utils.ts               # Currency formatters, safeLocalStorage
│   ├── tests/                     # Vitest & Testing Library test suites (30 tests)
│   │   ├── alerts.test.tsx        # Alert triage and action tests
│   │   ├── charts.test.tsx        # Recharts rendering & mode toggles
│   │   ├── metrics.test.tsx       # KPI calculations and currency formatting
│   │   ├── orders.test.tsx        # Search, filter, sorting, pagination, mutation
│   │   ├── reports.test.tsx       # Report generation & CSV export tests
│   │   ├── settings.test.tsx      # Zod validation and submission tests
│   │   └── states-and-storage.test.tsx # UI states & storage resilience tests
│   └── types/                     # TypeScript definitions and contracts
├── DECISION-LOG.md                # Architectural decisions & rationale
├── IMPLEMENTATION.md              # Technical implementation details
├── LIMITATIONS.md                 # Constraints & production roadmap
├── PROJECT-2-SUBMISSION.md        # Arrowstack requirements matrix
├── REQUIREMENTS.md                # Functional specifications & acceptance criteria
├── TESTING.md                     # Comprehensive test execution report
├── package.json                   # Dependencies and npm scripts
├── postcss.config.mjs             # PostCSS Tailwind configuration
├── tailwind.config.ts             # Tailwind design tokens
├── tsconfig.json                  # Strict TypeScript compiler options
├── vitest.config.ts               # Vitest test configuration
└── vitest.setup.ts                # Test setup & ResizeObserver mocks
```

---

## 6. Installation & Execution Commands

### Confirmed Environment & Tested Dependency Versions
- **Node.js**: `v24.13.1`
- **npm**: `11.8.0`
- **Next.js**: `14.2.24` (App Router)
- **React**: `18.3.1` & **React DOM**: `18.3.1`
- **TypeScript**: `5.9.3`
- **Tailwind CSS**: `3.4.19`
- **Recharts**: `2.15.4`
- **Vitest**: `2.1.9` & **Testing Library React**: `16.3.3`
- **React Hook Form**: `7.91.0` & **Zod**: `3.25.76`

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Type Checking
```bash
npm run typecheck
# or: npx tsc --noEmit
```
Expected result: `Clean exit with 0 errors`.

### Run Test Suite
```bash
npm test
```
Expected result: `7 passed (7), 30 passed (30)`.

### Production Build & Execution
```bash
npm run build
npm start
```
Compiles an optimized production bundle with 10 prerendered static routes.

---

## 7. Quality Assurance Summary

- **Tests Executed**: 30 tests across 7 test suites – 100% Passing.
- **TypeScript Typecheck**: Zero type errors under `strict: true`.
- **Production Build**: Successfully generated static bundles with Next.js App Router.
- **Accessibility**: Visible keyboard focus rings (`:focus-visible`), ARIA roles, semantic markup, and tabular screen-reader descriptions for charts.

