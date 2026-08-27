import { apiClient, toApiError, USE_MOCK_DATA } from './client'
import type {
  Account,
  AccountInvestigation,
  CircularTransaction,
  ConnectedAccount,
  DashboardSummary,
  Device,
  FraudRing,
  FraudSignal,
  RapidMoneyMovement,
  RiskOverviewCounts,
  SharedDeviceSignal,
  Transaction,
} from '@/types'
import {
  mockAccountInvestigation,
  mockAccounts,
  mockCircularTransaction,
  mockDashboardSummary,
  mockDevices,
  mockFraudRings,
  mockFraudSignals,
  mockRapidMoneyMovement,
  mockRiskOverview,
  mockSharedDeviceSignal,
  mockTransactions,
} from '@/mocks/data'

// ------------------------------------------------------------------
// All HTTP calls to the fraud-detection backend live in this file.
// UI components should never import axios or apiClient directly —
// they call the functions exported here instead. This keeps the
// exact endpoint paths easy to change in one place, and lets us
// fall back to mock data (VITE_USE_MOCK_DATA=true) while backend
// endpoints are still being built.
//
// Endpoints marked "TODO: confirm" are best-guess paths based on the
// Repository -> Service -> API architecture described by the backend
// team. Update the path string, not the calling code, once confirmed.
// ------------------------------------------------------------------

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

async function request<T>(fn: () => Promise<T>, mockFn: () => T | Promise<T>): Promise<T> {
  if (USE_MOCK_DATA) return delay(await mockFn())
  try {
    return await fn()
  } catch (err) {
    throw toApiError(err)
  }
}

// ---- Dashboard ----

// TODO: confirm endpoint. Backend may not expose aggregate stats yet;
// if it 404s, the UI shows "Data unavailable" rather than a fake number.
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request(
    async () => (await apiClient.get<DashboardSummary>('/api/fraud/dashboard/summary')).data,
    () => mockDashboardSummary,
  )
}

// TODO: confirm endpoint.
export async function getRiskOverview(): Promise<RiskOverviewCounts> {
  return request(
    async () => (await apiClient.get<RiskOverviewCounts>('/api/fraud/dashboard/risk-overview')).data,
    () => mockRiskOverview,
  )
}

// ---- Accounts ----

export async function getAccounts(): Promise<Account[]> {
  return request(
    async () => (await apiClient.get<Account[]>('/api/fraud/accounts')).data,
    () => mockAccounts,
  )
}

export async function getAccountInvestigation(accountId: string): Promise<AccountInvestigation> {
  return request(
    async () => (await apiClient.get<AccountInvestigation>(`/api/fraud/accounts/${accountId}`)).data,
    () => {
      const acct = mockAccountInvestigation(accountId)
      if (!acct) throw { status: 404, message: `Account ${accountId} was not found.` }
      return acct
    },
  )
}

// TODO: confirm endpoint. Should return accounts reachable from this
// account via shared transactions, devices, or people, for the graph.
export async function getConnectedAccounts(accountId: string): Promise<ConnectedAccount[]> {
  return request(
    async () => (await apiClient.get<ConnectedAccount[]>(`/api/fraud/accounts/${accountId}/connections`)).data,
    () => [],
  )
}

// ---- Transactions ----

export async function getTransactions(): Promise<Transaction[]> {
  return request(
    async () => (await apiClient.get<Transaction[]>('/api/fraud/transactions')).data,
    () => mockTransactions,
  )
}

export async function getTransaction(transactionId: string): Promise<Transaction> {
  return request(
    async () => (await apiClient.get<Transaction>(`/api/fraud/transactions/${transactionId}`)).data,
    () => {
      const tx = mockTransactions.find((t) => t.id === transactionId)
      if (!tx) throw { status: 404, message: `Transaction ${transactionId} was not found.` }
      return tx
    },
  )
}

// ---- Devices ----

export async function getDevices(): Promise<Device[]> {
  return request(
    async () => (await apiClient.get<Device[]>('/api/fraud/devices')).data,
    () => mockDevices,
  )
}

export async function getDevice(deviceId: string): Promise<Device> {
  return request(
    async () => (await apiClient.get<Device>(`/api/fraud/devices/${deviceId}`)).data,
    () => {
      const d = mockDevices.find((x) => x.id === deviceId)
      if (!d) throw { status: 404, message: `Device ${deviceId} was not found.` }
      return d
    },
  )
}

// ---- Fraud signal detectors ----
// These map to the three detection algorithms the backend currently
// implements. Each returns the raw detector output; the "signals feed"
// (getFraudSignals) is a normalized combination of all of them.

export async function getSharedDevices(): Promise<SharedDeviceSignal[]> {
  return request(
    async () => (await apiClient.get<SharedDeviceSignal[]>('/api/fraud/signals/shared-device')).data,
    () => [mockSharedDeviceSignal],
  )
}

export async function getRapidMoneyMovement(): Promise<RapidMoneyMovement[]> {
  return request(
    async () => (await apiClient.get<RapidMoneyMovement[]>('/api/fraud/signals/rapid-movement')).data,
    () => [mockRapidMoneyMovement],
  )
}

export async function getCircularTransactions(): Promise<CircularTransaction[]> {
  return request(
    async () => (await apiClient.get<CircularTransaction[]>('/api/fraud/signals/circular-transactions')).data,
    () => [mockCircularTransaction],
  )
}

// TODO: confirm endpoint. Normalized, paginated feed of every signal
// type for the Fraud Signals page. If unavailable, the page composes
// one client-side from the three detector calls above.
export async function getFraudSignals(): Promise<FraudSignal[]> {
  return request(
    async () => (await apiClient.get<FraudSignal[]>('/api/fraud/signals')).data,
    () => mockFraudSignals,
  )
}

// ---- Fraud rings ----

// TODO: confirm endpoint. Fraud ring clustering is a heavier graph
// query; backend may compute this on demand or on a schedule.
export async function getFraudRings(): Promise<FraudRing[]> {
  return request(
    async () => (await apiClient.get<FraudRing[]>('/api/fraud/rings')).data,
    () => mockFraudRings,
  )
}

export async function getFraudRing(ringId: string): Promise<FraudRing> {
  return request(
    async () => (await apiClient.get<FraudRing>(`/api/fraud/rings/${ringId}`)).data,
    () => {
      const ring = mockFraudRings.find((r) => r.ring_id === ringId)
      if (!ring) throw { status: 404, message: `Fraud ring ${ringId} was not found.` }
      return ring
    },
  )
}

// ---- Global search ----

export interface SearchResults {
  accounts: Account[]
  transactions: Transaction[]
  devices: Device[]
}

// TODO: confirm endpoint. Falls back to filtering already-fetched
// collections client-side when the backend doesn't yet expose a
// unified search endpoint.
export async function globalSearch(query: string): Promise<SearchResults> {
  return request(
    async () => (await apiClient.get<SearchResults>('/api/fraud/search', { params: { q: query } })).data,
    async () => {
      const q = query.trim().toUpperCase()
      const [accounts, transactions, devices] = [mockAccounts, mockTransactions, mockDevices]
      return {
        accounts: accounts.filter((a) => a.account_id.includes(q) || a.person_name?.toUpperCase().includes(q)),
        transactions: transactions.filter((t) => t.id.includes(q)),
        devices: devices.filter((d) => d.id.includes(q) || d.fingerprint.toUpperCase().includes(q)),
      }
    },
  )
}
