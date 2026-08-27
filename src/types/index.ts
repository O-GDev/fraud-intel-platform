// ============================================================
// Core domain types shared across the app.
// These mirror the shapes the FastAPI backend is expected to
// return. Optional fields reflect data that may not exist yet
// (e.g. a person hasn't been linked, a risk score not computed).
// ============================================================

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export interface Person {
  id: string
  name: string
  phone?: string
  email?: string
}

export interface Bank {
  id: string
  name: string
  code: string
}

export interface Device {
  id: string
  fingerprint: string
  type?: string
  operating_system?: string
  associated_people?: string[]
  associated_accounts?: string[]
  risk?: RiskLevel
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  type: string
  channel: string
  status: string
  timestamp: string
  source_account?: string
  destination_account?: string
  device_id?: string
}

export interface Account {
  account_id: string
  account_number: string
  account_type: string
  risk?: RiskLevel
  person_id?: string
  person_name?: string
  bank_id?: string
  bank_name?: string
  bank_code?: string
  transaction_count?: number
  device_count?: number
}

export interface AccountInvestigation {
  account_id: string
  account_number: string
  account_type: string
  risk?: RiskLevel

  person_id?: string
  person_name?: string
  person_phone?: string
  person_email?: string

  bank_id?: string
  bank_name?: string
  bank_code?: string

  transactions: Transaction[]
  devices: Device[]
}

export interface SharedDeviceSignal {
  device_id: string
  fingerprint: string
  people: string[]
  number_of_people: number
  device_type?: string
  operating_system?: string
}

export interface RapidMoneyMovement {
  source_account: string
  intermediate_account: string
  destination_account: string
  first_transaction: string
  second_transaction: string
  first_amount: number
  second_amount: number
  first_timestamp: string
  second_timestamp: string
  time_difference_seconds: number
}

export interface CircularTransaction {
  account_1: string
  account_2: string
  account_3: string
  transaction_1: string
  transaction_2: string
  transaction_3: string
  amount_1: number
  amount_2: number
  amount_3: number
  timestamp_1: string
  timestamp_2: string
  timestamp_3: string
}

export type SignalType =
  | 'SHARED_DEVICE'
  | 'RAPID_MONEY_MOVEMENT'
  | 'CIRCULAR_TRANSACTION'
  | 'SUSPICIOUS_CONNECTION'
  | 'FRAUD_RING'

export interface FraudSignal {
  id: string
  type: SignalType
  severity: RiskLevel
  accounts: string[]
  transactions: string[]
  timestamp: string
  explanation: string
  evidence?: string[]
  status: 'OPEN' | 'REVIEWING' | 'CLOSED' | 'CONFIRMED_FRAUD' | 'DISMISSED'
  detail?: SharedDeviceSignal | RapidMoneyMovement | CircularTransaction
}

export interface FraudRing {
  ring_id: string
  risk_score?: number
  account_count: number
  people_count: number
  device_count: number
  transaction_count: number
  total_value: number
  signals: SignalType[]
  accounts?: string[]
  people?: string[]
  devices?: string[]
}

export interface DashboardSummary {
  accounts_investigated: number | null
  active_fraud_signals: number | null
  suspicious_transactions: number | null
  fraud_rings_detected: number | null
}

export interface RiskOverviewCounts {
  critical: number
  high: number
  medium: number
  low: number
}

export interface ConnectedAccount {
  account_id: string
  relationship: string
  via_transaction?: string
  risk?: RiskLevel
}

// ---- Graph model used by GraphViewer ----

export type GraphNodeType = 'person' | 'account' | 'transaction' | 'device' | 'bank' | 'fraud_ring'

export interface GraphNodeData {
  id: string
  type: GraphNodeType
  label: string
  sublabel?: string
  risk?: RiskLevel
}

export interface GraphEdgeData {
  id: string
  source: string
  target: string
  relationship: string
  amount?: number
  timestamp?: string
}

// ---- API envelope helpers ----

export interface ApiError {
  status: number | 'network'
  message: string
}
