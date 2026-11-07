# OpsView – Application Screenshots & Visual Audit

This folder contains genuine, high-resolution screenshots captured directly from the running production build of OpsView via headless browser automation.

## Genuine Screenshots Captured

| File Name | Dimensions | Target Route | Size | Verified Content |
|---|---|---|---|---|
| `overview-dashboard.png` | 1440 × 900 | `/` | 64.5 KB | 4 KPI cards, Revenue trajectory area chart, Fulfillment pipeline donut, Sector sales, Recent transactions, and Operational alerts |
| `analytics-page.png` | 1440 × 900 | `/analytics` | 76.1 KB | Revenue vs Target benchmark bar charts, Net Margin stack, Cohort growth lines, and Sector profitability |
| `orders-page.png` | 1440 × 900 | `/orders` | 50.2 KB | Filter toolbar, multi-column sortable orders ledger, pagination, and Order Details inspection modal |
| `customers-page.png` | 1440 × 900 | `/customers` | 74.9 KB | Directory KPI cards, Cohort retention chart, Customer accounts table, and Customer detail modal |
| `alerts-page.png` | 1440 × 900 | `/alerts` | 70.5 KB | Operational bottleneck triage feed with severity indicators, category filters, and mark-as-read controls |
| `reports-page.png` | 1440 × 900 | `/reports` | 77.8 KB | Multi-domain audit report configuration, live data preview table, and CSV download action |
| `mobile-dashboard.png` | 375 × 812 | `/` | 20.9 KB | Responsive mobile dashboard layout with hamburger navigation and stacked KPI cards |
| `mobile-orders.png` | 375 × 812 | `/orders` | 13.9 KB | Responsive mobile order cards and compact filter controls |

---

## How Screenshots Were Generated
Captured automatically from the compiled production server using Chrome headless automation script:
```bash
node scripts/capture-screenshots.mjs
```
All images are genuine rendered views of the Next.js application. Zero mockups or placeholder graphics were used.

---

## Visual Design Highlights Verified
- **Theme**: Light theme with executive SaaS aesthetic (`#f8fafc` background, slate typography, brand blue `#0c8de9` accents).
- **Typography & Elevation**: Clear visual hierarchy, soft rounded cards (`rounded-2xl`), subtle borders (`border-slate-200/90`), and refined focus rings (`:focus-visible`).
- **Real-Time Indicators**: Pulsing live telemetry badges on overview and alert items.
