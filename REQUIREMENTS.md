# OpsView – Executive Operations Dashboard: Requirements Specification

## 1. Stakeholder & Problem Statement

### 1.1 Stakeholder Persona
- **Primary Stakeholder**: Business Operations Manager / VP of Operations / Chief Operating Officer (COO).
- **Secondary Stakeholders**: Logistics Dispatchers, Customer Success Leads, Financial Controllers.

### 1.2 Problem Statement
Executive decision-makers in rapid-growth logistics and service organizations often lack real-time visibility into operational health. Traditional ERP interfaces are fragmented, slow, and fail to immediately highlight operational bottlenecks such as delayed fulfillment SLAs, critical low-inventory thresholds, and failed payment transactions. 

### 1.3 Core Business Objective
OpsView delivers an executive operations command center that enables business managers to:
1. Instantly comprehend operational revenue velocity and order volume versus planned baseline targets.
2. Uncover and triage pending operational bottlenecks (e.g. orders awaiting manual review > 24 hours, critical stock alerts).
3. Supervise customer cohort expansion, recurring accounts, and lifetime order values.
4. Export audit-ready CSV records for stakeholder presentations and compliance reviews.

---

## 2. Scope & Functional Requirements

### 2.1 Overview Dashboard (`/`)
- **Key Performance Indicators (KPIs)**:
  - Total Revenue (Target ₹4,50,000 baseline; current value ₹5,00,000; +14.9% growth).
  - Total Orders (Current 250 orders; vs 220 previous period; +13.6% growth).
  - Active Customers (Current 180 active; vs 165 previous period; +9.1% growth).
  - Pending Orders (Current 25 orders in queue; -21.9% reduction in backlog).
- **Visual Analytics**:
  - Revenue & Orders trajectory area chart with view toggle (Revenue, Orders, Combined).
  - Order Fulfillment pipeline status donut chart (Delivered, Shipped, Processing, On Hold, Cancelled).
  - Sector revenue breakdown (Cloud Infrastructure, Software Subscriptions, Enterprise Consulting, Hardware IoT, SLA Support).
  - Operational bottlenecks & incident alert triage list.
  - Recent transactions ledger with quick drawer preview.
- **Date Filtering**: Quick presets (`Today`, `7D`, `30D`, `90D`, `YTD`, `1Y`).

### 2.2 Financial & Performance Analytics (`/analytics`)
- Dynamic multi-granularity switching (`Monthly`, `Weekly`, `Daily`).
- Actual Revenue vs Planned Budget variance visualization.
- Operating Expenses vs Net Operating Margin contribution stack.
- Customer Cohort Acquisition & Retention line chart (Total Active, Returning Customers, New Acquisitions).
- Vertical sector profitability metrics with YoY percentage growth tags.

### 2.3 Orders Management (`/orders`)
- Comprehensive tabular display of orders with columns:
  - Order ID, Customer Name & Email, Order Date, Product/Service summary, Amount (INR), Payment Status, Fulfillment Status, and Action.
- Full-text multi-field search (Customer name, Order ID, SKU, Shipping Address).
- Dual filter dropdowns for Fulfillment Status and Payment Status.
- Multi-column sorting (Date, Amount, Customer Name, ID) with toggleable direction (Ascending / Descending).
- Responsive pagination with configurable page sizes (5, 10, 20, 50).
- Order details modal allowing status mutation (e.g., transition from `Processing` to `Delivered`) and operational notes saving.
- Friendly zero-results empty state.

### 2.4 Customer Accounts & Cohorts (`/customers`)
- High-level directory KPI cards: Total Directory (192), Active Customers (180), New Acquisitions (42), Returning Accounts (150).
- Cohort Growth & Retention area chart.
- Customer directory table with search, cohort type filter (`VIP`, `Returning`, `New`), and status filter (`Active`, `Inactive`).
- Customer detail modal displaying lifetime order count, aggregate spend, average order value, contact details, and account memos.

### 2.5 Operational Alerts & Incident Triage (`/alerts`)
- Incident feeds across categories:
  - Pending order SLA violations (> 24 hours).
  - Critical low inventory (e.g. Edge IoT Sensor Hub < 3 units).
  - Payment gateway timeouts and authorization failures.
  - Logistics courier route disruptions.
  - System maintenance and ERP ledger synchronization audits.
- Severity classification: `Critical` (Rose), `Warning` (Amber), `Info` (Blue).
- Filter by category and severity.
- Individual "Mark as Read", global "Mark All as Read", and "Dismiss" capabilities.

### 2.6 Executive Reports & CSV Exports (`/reports`)
- Customizable date window selection (`Today`, `7D`, `30D`, `90D`, `YTD`, `1Y`).
- Domain selection checkboxes: Revenue & Margins, Order Ledger, Customer Roster, Bottlenecks & Alerts.
- Interactive compilation with sample data preview table.
- Browser-native CSV file generation and export download.

### 2.7 Executive Settings & Preferences (`/settings`)
- Form validated with Zod schema and React Hook Form.
- Profile information: Full Name, Business Email, Designation, Enterprise Unit.
- Localization: Currency selection (`INR`, `USD`, `EUR`, `GBP`).
- Telemetry: Auto-refresh rate (15 to 3600 seconds) and compact table density toggle.
- Notifications: SLA push alerts, email gateway notices, weekly operational digest.
- Instant LocalStorage persistence and toast feedback.

---

## 3. Measurable Acceptance Criteria

| ID | Criterion | Target Metric | Validation Method |
|---|---|---|---|
| AC-1 | KPI Mathematical Consistency | Sum of categories = ₹5,00,000; orders = 250 | Unit tests & runtime assertions |
| AC-2 | Interactive Responsiveness | Instant UI updates upon filter or state changes | React testing library fireEvent |
| AC-3 | Order Status Mutation | Status updates persist across page reloads via LocalStorage | LocalStorage integration tests |
| AC-4 | Error Resilience | 503 simulation renders friendly error state with retry | Error boundary simulation test |
| AC-5 | Storage Fallback | Memory fallback operates when LocalStorage throws QuotaExceededError | Vitest storage mock tests |
| AC-6 | Accessibility Standard | Screen reader summaries, ARIA attributes, visible focus rings | Automated DOM inspection & WCAG audit |
| AC-7 | Multi-device Layout | Seamless layouts at 375px, 768px, 1366px, 1920px | Tailwind responsive classes audit |

