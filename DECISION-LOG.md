# OpsView – Executive Operations Dashboard: Architectural Decision Log

## Decision 1: Next.js 14 App Router Architecture
- **Date**: March 2026
- **Context**: The requirements specify Next.js App Router with TypeScript, Tailwind CSS, and Recharts.
- **Decision**: Implemented modular App Router layout with `src/app/` serving page routes (`/`, `/analytics`, `/orders`, `/customers`, `/alerts`, `/reports`, `/settings`). Wrapped views inside `src/components/layout/DashboardLayout.tsx` and centralized context in `src/context/OpsContext.tsx`.
- **Reason**: Next.js App Router provides static prerendering, optimized code splitting, and zero client footprint for static layouts.
- **Consequences**: Fast page transitions, high Lighthouse performance, and clean route structure.

---

## Decision 2: Currency Standards & Indian Rupee (INR) Default
- **Date**: March 2026
- **Context**: Project prompt mentions baseline targets such as ₹5,00,000 revenue, 250 orders, 180 customers, and 25 pending orders.
- **Decision**: Configured Indian Rupee (₹) as the primary executive reporting standard, formatted via `Intl.NumberFormat("en-IN")` with support for compact numbering (`₹5.00 L`, `₹1.75 Cr`), while enabling optional USD, EUR, and GBP configuration via `/settings`.
- **Reason**: Perfectly aligns with the project prompt's explicit financial metrics while maintaining international multi-currency capability.

---

## Decision 3: Decoupled Mock REST Service with LocalStorage & In-Memory Fallback
- **Date**: March 2026
- **Context**: Prompt mandates realistic mock REST-style data, simulated asynchronous delays, and local persistence without claiming connection to a live backend.
- **Decision**: Developed `src/lib/api.ts` exposing async methods with artificial 80-150ms network latency. Persisted mutations via `safeLocalStorage` which features automatic fallback to memory if LocalStorage is unavailable or throws `QuotaExceededError`.
- **Reason**: Allows users to interactively modify order statuses, toggle alert read states, or save profile preferences with persistent state across browser reloads, while safeguarding against storage exceptions in private/incognito browsing.

---

## Decision 4: Interactive Simulated Anomaly (503 Error Mode)
- **Date**: March 2026
- **Context**: Senior frontend architecture mandates verifying all 4 required UI states: Loading, Empty, Error, and Success.
- **Decision**: Built a prominent "Simulate API Error" toggle in the top demo banner that forces simulated 503 Server Errors across all REST calls.
- **Reason**: Allows interviewers, testers, and evaluators to immediately verify that error boundaries, friendly messages, and retry buttons function cleanly without breaking application state.

---

## Decision 5: Responsive Visualization Strategy with Recharts
- **Date**: March 2026
- **Context**: Charts must update based on selected filters, look executive-grade, and remain responsive from mobile (375px) to 4K displays.
- **Decision**: Used `ResponsiveContainer` across Area, Bar, and Donut charts with customized tooltips rendered as clean, high-contrast dark pills (`#0f172a`). In addition, rendered accessible HTML summary tables hidden from visual view but accessible to screen readers (`sr-only`).
- **Reason**: Delivers clean SaaS visual polish while conforming to WCAG accessibility principles.

