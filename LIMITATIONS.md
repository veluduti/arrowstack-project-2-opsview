# OpsView – Executive Operations Dashboard: Limitations & Future Roadmap

This document outlines the current boundaries of the demonstration application and details the production-readiness roadmap for live enterprise deployment.

---

## 1. Current Architecture Limitations

### 1.1 Client-Side Simulated Persistence
- **Current State**: Operational state mutations (e.g., changing order status, marking alerts read, saving user preferences) are stored in the browser's `localStorage` via the `safeLocalStorage` abstraction, with an in-memory dictionary fallback.
- **Limitation**: State changes are confined to the individual browser instance and device. Two executives viewing the application simultaneously on separate machines will not see synchronized mutations without a shared database.
- **Production Roadmap**:
  - Implement a Postgres / DynamoDB persistence layer.
  - Integrate WebSocket or Server-Sent Events (SSE) subscriptions for real-time live updates between logistics hubs and executive monitors.

### 1.2 Authentication & Role-Based Access Control (RBAC)
- **Current State**: The application models an authenticated executive persona ("Aarav Sharma - VP of Operations") with preloaded preferences and simulated permissions.
- **Limitation**: There is no live OAuth2, SAML SSO, or JWT session verification gating route access.
- **Production Roadmap**:
  - Integrate NextAuth.js or Clerk with enterprise SSO (Okta, Azure Active Directory).
  - Enforce granular RBAC (e.g. Operations Managers can mutate order fulfillment status; Read-Only Auditing role can only inspect and export reports).

### 1.3 Static Cohort Dataset Boundaries
- **Current State**: The database contains 20 curated baseline order records, 12 customer records, 5 operational alerts, and 6 months of fiscal telemetry that perfectly match the prompt's metrics (₹5,00,000 revenue, 250 orders, 180 customers, 25 pending).
- **Limitation**: Real enterprise operations involve tens of thousands of continuous transaction events per minute.
- **Production Roadmap**:
  - Implement server-side streaming cursor pagination (`keyset pagination`).
  - Introduce an OLAP analytical warehouse (ClickHouse or Snowflake) for sub-second aggregations across millions of historic ledger rows.

### 1.4 Data Governance & PII Compliance
- **Current State**: Mock records use synthetic names, generic corporate domains, and simulated addresses.
- **Limitation**: In live production, customer phone numbers and physical shipping locations represent Personally Identifiable Information (PII) regulated under GDPR and DPDP Act.
- **Production Roadmap**:
  - Implement field-level encryption for customer PII.
  - Implement role-masked display (e.g. showing `+91 98*** **345`) for unauthorized roles.
  - Automated data retention lifecycle policies.

