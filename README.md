# Sentry — Fraud Intelligence & Investigation Platform

A React + TypeScript frontend for a Neo4j/FastAPI fraud-detection backend. Built for
analysts investigating accounts, transactions, devices, and fraud rings in a
Nigerian financial-crime context.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark, financial/security aesthetic)
- React Router
- Axios (centralized API layer)
- React Flow (investigation graph visualization)
- Recharts (risk overview chart)
- Lucide React (icons)

## Getting started

```bash
npm install
cp .env.example .env   # edit VITE_API_BASE_URL if your backend isn't on :8000
npm run dev
```

The app runs at `http://localhost:5173` by default and expects the FastAPI backend
at the URL configured in `.env` (`VITE_API_BASE_URL`, default `http://localhost:8000`).

To build for production:

```bash
npm run build
npm run preview
```

## Working without a live backend

Set `VITE_USE_MOCK_DATA=true` in `.env` to run the whole app against static mock
data in `src/mocks/data.ts` (matching the sample dataset: accounts A001–A008,
transactions T020–T032, devices D001–D004). This lets the frontend be developed
and demoed before every backend endpoint exists. Flip it back to `false` to hit
the real API.

## Project structure

```
src/
├── api/            client.ts (axios instance + error normalization), fraudApi.ts (all backend calls)
├── components/
│   ├── layout/      Layout, Sidebar, Header
│   ├── common/       RiskBadge, StatCard, SearchBar, LoadingState, ErrorState, EmptyState, Pagination, StatusPill
│   ├── graph/        GraphViewer (React Flow), GraphLegend, custom node renderer
│   ├── dashboard/    RiskOverviewChart
│   ├── signals/      SignalCard (expandable)
│   ├── accounts/     AccountTable
│   ├── transactions/ TransactionTable
│   ├── devices/      DeviceTable
│   └── fraud-rings/  FraudRingCard
├── pages/            one file per route (see below)
├── hooks/            useAsync — load/error/retry data-fetching hook
├── types/            shared TypeScript interfaces
├── utils/            format.ts (currency/date), riskEngine.ts (illustrative scoring)
├── mocks/            static fallback dataset
└── routes are declared directly in App.tsx
```

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/accounts` | Account explorer |
| `/investigations` | Investigation hub (search + flagged accounts) |
| `/investigations/accounts/:accountId` | Account investigation (owner, bank, devices, transactions, graph) |
| `/transactions` | Transaction list |
| `/transactions/:transactionId` | Transaction details + flow graph |
| `/devices` | Device list |
| `/devices/:deviceId` | Device details + shared-device graph |
| `/signals` | Fraud signals feed (shared device, rapid movement, circular, etc.) |
| `/fraud-rings` | Fraud ring list |
| `/fraud-rings/:ringId` | Fraud ring investigation |
| `/settings` | Environment / connection info |

## API layer & backend integration

Every backend call lives in `src/api/fraudApi.ts`. Components never call axios
directly — they call functions like `getAccountInvestigation(id)`,
`getSharedDevices()`, `getFraudRings()`, etc. Endpoints marked with a
`TODO: confirm` comment are best-guess paths based on the Repository → Service →
API structure described for the backend; change the path string there once the
real route is known, and every caller updates automatically.

If an endpoint isn't available yet (e.g. dashboard aggregate stats), the UI
shows **"Data unavailable"** instead of a fabricated number.

## Risk scoring

The backend does not currently return a computed `risk_score`. The UI derives an
**illustrative risk score** client-side from detected signal types
(`src/utils/riskEngine.ts`) and clearly labels it as illustrative everywhere it
appears. Once the backend exposes a real `risk_score` field, swap the relevant
call sites to use it directly instead of `computeIllustrativeScore`.

## Notes

- Currency is formatted as NGN (₦) via `formatCurrency` / `formatCompactCurrency` in `src/utils/format.ts`.
- Dates are formatted via `formatDate` / `formatDateTime`, expecting ISO strings from the backend.
- The investigation graph (`GraphViewer`) is used on the dashboard, account investigation, transaction details, device details, and fraud ring pages — pass it `GraphNodeData[]` / `GraphEdgeData[]` and it handles layout, zoom/pan, node-click highlighting, and legend.
- Responsive down to 390px: sidebar becomes a mobile drawer, tables scroll horizontally.
