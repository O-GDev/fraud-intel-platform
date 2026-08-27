// Mock data used ONLY when VITE_USE_MOCK_DATA=true.
// Mirrors the sample dataset described by the backend team so the
// frontend can be built and demoed before every endpoint exists.
// Never import this from src/api/fraudApi.ts logic that is meant
// to hit the real backend in production.
import type {
  Account,
  AccountInvestigation,
  CircularTransaction,
  DashboardSummary,
  Device,
  FraudRing,
  FraudSignal,
  RapidMoneyMovement,
  RiskOverviewCounts,
  SharedDeviceSignal,
  Transaction,
} from '@/types'

export const mockBanks = [
  { id: 'B001', name: 'Apex Bank', code: 'APEX' },
  { id: 'B002', name: 'Nova Bank', code: 'NOVA' },
  { id: 'B003', name: 'Unity Trust', code: 'UNTY' },
  { id: 'B004', name: 'Sterling Finance', code: 'STFN' },
  { id: 'B005', name: 'Horizon Bank', code: 'HRZN' },
]

export const mockPeople = [
  { id: 'P001', name: 'Daniel Okafor', phone: '08030000001', email: 'daniel@example.com' },
  { id: 'P002', name: 'Michael Adeyemi', phone: '08030000002', email: 'michael@example.com' },
  { id: 'P003', name: 'Samuel Bello', phone: '08030000003', email: 'samuel@example.com' },
  { id: 'P004', name: 'Grace Johnson', phone: '08030000004', email: 'grace@example.com' },
  { id: 'P005', name: 'Tunde Ibrahim', phone: '08030000005', email: 'tunde@example.com' },
  { id: 'P006', name: 'Victor James', phone: '08030000006', email: 'victor@example.com' },
  { id: 'P007', name: 'Sarah Williams', phone: '08030000007', email: 'sarah@example.com' },
  { id: 'P008', name: 'Emeka Obi', phone: '08030000008', email: 'emeka@example.com' },
  { id: 'P009', name: 'Joseph Adams', phone: '08030000009', email: 'joseph@example.com' },
  { id: 'P010', name: 'Linda Carter', phone: '08030000010', email: 'linda@example.com' },
]

export const mockDevices: Device[] = [
  { id: 'D001', fingerprint: 'fp-device-001', type: 'Mobile', operating_system: 'Android', associated_people: ['Daniel Okafor', 'Michael Adeyemi', 'Samuel Bello'], associated_accounts: ['A001', 'A002', 'A003'], risk: 'HIGH' },
  { id: 'D002', fingerprint: 'fp-device-002', type: 'Desktop', operating_system: 'Windows', associated_people: ['Grace Johnson'], associated_accounts: ['A004'], risk: 'LOW' },
  { id: 'D003', fingerprint: 'fp-device-003', type: 'Mobile', operating_system: 'iOS', associated_people: ['Tunde Ibrahim'], associated_accounts: ['A005'], risk: 'LOW' },
  { id: 'D004', fingerprint: 'fp-device-004', type: 'Mobile', operating_system: 'Android', associated_people: ['Victor James'], associated_accounts: ['A006'], risk: 'MEDIUM' },
]

const accountMeta: Record<string, { person: string; personId: string; bank: string; bankCode: string; bankId: string; type: string; risk: Account['risk'] }> = {
  A001: { person: 'Daniel Okafor', personId: 'P001', bank: 'Apex Bank', bankCode: 'APEX', bankId: 'B001', type: 'SAVINGS', risk: 'HIGH' },
  A002: { person: 'Victor James', personId: 'P006', bank: 'Nova Bank', bankCode: 'NOVA', bankId: 'B002', type: 'CURRENT', risk: 'MEDIUM' },
  A003: { person: 'Michael Adeyemi', personId: 'P002', bank: 'Unity Trust', bankCode: 'UNTY', bankId: 'B003', type: 'SAVINGS', risk: 'HIGH' },
  A004: { person: 'Grace Johnson', personId: 'P004', bank: 'Sterling Finance', bankCode: 'STFN', bankId: 'B004', type: 'SAVINGS', risk: 'CRITICAL' },
  A005: { person: 'Tunde Ibrahim', personId: 'P005', bank: 'Horizon Bank', bankCode: 'HRZN', bankId: 'B005', type: 'SAVINGS', risk: 'CRITICAL' },
  A006: { person: 'Sarah Williams', personId: 'P007', bank: 'Apex Bank', bankCode: 'APEX', bankId: 'B001', type: 'CURRENT', risk: 'CRITICAL' },
  A007: { person: 'Samuel Bello', personId: 'P003', bank: 'Nova Bank', bankCode: 'NOVA', bankId: 'B002', type: 'SAVINGS', risk: 'HIGH' },
  A008: { person: 'Joseph Adams', personId: 'P009', bank: 'Unity Trust', bankCode: 'UNTY', bankId: 'B003', type: 'SAVINGS', risk: 'LOW' },
}

export const mockAccounts: Account[] = Object.entries(accountMeta).map(([id, m], i) => ({
  account_id: id,
  account_number: `10000000${String(i + 1).padStart(2, '0')}`,
  account_type: m.type,
  risk: m.risk,
  person_id: m.personId,
  person_name: m.person,
  bank_id: m.bankId,
  bank_name: m.bank,
  bank_code: m.bankCode,
  transaction_count: 2,
  device_count: 1,
}))

export const mockTransactions: Transaction[] = [
  { id: 'T020', amount: 2500000, currency: 'NGN', type: 'TRANSFER', channel: 'MOBILE_APP', status: 'COMPLETED', timestamp: '2026-08-20T14:00:00', source_account: 'A001', destination_account: 'A003', device_id: 'D001' },
  { id: 'T021', amount: 2300000, currency: 'NGN', type: 'TRANSFER', channel: 'MOBILE_APP', status: 'COMPLETED', timestamp: '2026-08-20T14:02:00', source_account: 'A003', destination_account: 'A007', device_id: 'D001' },
  { id: 'T022', amount: 2100000, currency: 'NGN', type: 'TRANSFER', channel: 'INTERNET_BANKING', status: 'COMPLETED', timestamp: '2026-08-20T14:10:00', source_account: 'A007', destination_account: 'A002', device_id: 'D001' },
  { id: 'T030', amount: 800000, currency: 'NGN', type: 'TRANSFER', channel: 'MOBILE_APP', status: 'COMPLETED', timestamp: '2026-08-19T09:00:00', source_account: 'A004', destination_account: 'A005', device_id: 'D002' },
  { id: 'T031', amount: 760000, currency: 'NGN', type: 'TRANSFER', channel: 'MOBILE_APP', status: 'COMPLETED', timestamp: '2026-08-19T09:20:00', source_account: 'A005', destination_account: 'A006', device_id: 'D003' },
  { id: 'T032', amount: 720000, currency: 'NGN', type: 'TRANSFER', channel: 'INTERNET_BANKING', status: 'COMPLETED', timestamp: '2026-08-19T09:45:00', source_account: 'A006', destination_account: 'A004', device_id: 'D004' },
]

export function mockAccountInvestigation(accountId: string): AccountInvestigation | null {
  const meta = accountMeta[accountId]
  if (!meta) return null
  const person = mockPeople.find((p) => p.id === meta.personId)
  const idx = Object.keys(accountMeta).indexOf(accountId)
  return {
    account_id: accountId,
    account_number: `10000000${String(idx + 1).padStart(2, '0')}`,
    account_type: meta.type,
    risk: meta.risk,
    person_id: meta.personId,
    person_name: meta.person,
    person_phone: person?.phone,
    person_email: person?.email,
    bank_id: meta.bankId,
    bank_name: meta.bank,
    bank_code: meta.bankCode,
    transactions: mockTransactions.filter((t) => t.source_account === accountId || t.destination_account === accountId),
    devices: mockDevices.filter((d) => d.associated_accounts?.includes(accountId)),
  }
}

export const mockSharedDeviceSignal: SharedDeviceSignal = {
  device_id: 'D001',
  fingerprint: 'fp-device-001',
  people: ['Daniel Okafor', 'Michael Adeyemi', 'Samuel Bello'],
  number_of_people: 3,
  device_type: 'Mobile',
  operating_system: 'Android',
}

export const mockRapidMoneyMovement: RapidMoneyMovement = {
  source_account: 'A001',
  intermediate_account: 'A003',
  destination_account: 'A007',
  first_transaction: 'T020',
  second_transaction: 'T021',
  first_amount: 2500000,
  second_amount: 2300000,
  first_timestamp: '2026-08-20T14:00:00',
  second_timestamp: '2026-08-20T14:02:00',
  time_difference_seconds: 120,
}

export const mockCircularTransaction: CircularTransaction = {
  account_1: 'A004',
  account_2: 'A005',
  account_3: 'A006',
  transaction_1: 'T030',
  transaction_2: 'T031',
  transaction_3: 'T032',
  amount_1: 800000,
  amount_2: 760000,
  amount_3: 720000,
  timestamp_1: '2026-08-19T09:00:00',
  timestamp_2: '2026-08-19T09:20:00',
  timestamp_3: '2026-08-19T09:45:00',
}

export const mockFraudSignals: FraudSignal[] = [
  {
    id: 'SIG-001',
    type: 'SHARED_DEVICE',
    severity: 'HIGH',
    accounts: ['A001', 'A003', 'A007'],
    transactions: [],
    timestamp: '2026-08-20T14:00:00',
    explanation: 'Multiple people/accounts are associated with the same device fingerprint.',
    evidence: ['Device D001 used by 3 distinct account holders', 'Fingerprint fp-device-001 seen across accounts A001, A003, A007'],
    status: 'OPEN',
    detail: mockSharedDeviceSignal,
  },
  {
    id: 'SIG-002',
    type: 'RAPID_MONEY_MOVEMENT',
    severity: 'HIGH',
    accounts: ['A001', 'A003', 'A007'],
    transactions: ['T020', 'T021'],
    timestamp: '2026-08-20T14:02:00',
    explanation: 'Funds moved through an intermediate account within 120 seconds, consistent with layering behavior.',
    evidence: ['₦2,500,000 sent A001 → A003 at 14:00', '₦2,300,000 sent A003 → A007 at 14:02, 120s later'],
    status: 'REVIEWING',
    detail: mockRapidMoneyMovement,
  },
  {
    id: 'SIG-003',
    type: 'CIRCULAR_TRANSACTION',
    severity: 'CRITICAL',
    accounts: ['A004', 'A005', 'A006'],
    transactions: ['T030', 'T031', 'T032'],
    timestamp: '2026-08-19T09:45:00',
    explanation: 'Funds returned to the originating account after passing through two intermediaries, a classic circular flow.',
    evidence: ['A004 → A005 → A006 → A004', 'Total cycle value ₦2,280,000 across 3 transactions'],
    status: 'OPEN',
    detail: mockCircularTransaction,
  },
]

export const mockFraudRings: FraudRing[] = [
  {
    ring_id: 'RING-001',
    risk_score: 88,
    account_count: 6,
    people_count: 6,
    device_count: 2,
    transaction_count: 6,
    total_value: 9180000,
    signals: ['SHARED_DEVICE', 'RAPID_MONEY_MOVEMENT', 'CIRCULAR_TRANSACTION'],
    accounts: ['A001', 'A002', 'A003', 'A004', 'A005', 'A006', 'A007'],
    people: ['Daniel Okafor', 'Michael Adeyemi', 'Samuel Bello', 'Grace Johnson', 'Tunde Ibrahim', 'Sarah Williams'],
    devices: ['D001', 'D002', 'D003', 'D004'],
  },
]

export const mockDashboardSummary: DashboardSummary = {
  accounts_investigated: mockAccounts.length,
  active_fraud_signals: mockFraudSignals.filter((s) => s.status === 'OPEN' || s.status === 'REVIEWING').length,
  suspicious_transactions: mockTransactions.length,
  fraud_rings_detected: mockFraudRings.length,
}

export const mockRiskOverview: RiskOverviewCounts = {
  critical: mockAccounts.filter((a) => a.risk === 'CRITICAL').length,
  high: mockAccounts.filter((a) => a.risk === 'HIGH').length,
  medium: mockAccounts.filter((a) => a.risk === 'MEDIUM').length,
  low: mockAccounts.filter((a) => a.risk === 'LOW').length,
}
