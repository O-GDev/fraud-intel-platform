import type { FraudSignal, RiskLevel, SignalType } from '@/types'

// ------------------------------------------------------------------
// ILLUSTRATIVE risk scoring. The backend does not yet expose a real
// risk_score for accounts, so this derives a rough, transparent score
// from the signals attached to an account for the UI to show analysts
// *something* meaningful. Every place this is used is labeled
// "Illustrative risk score" in the UI. Once the backend returns a real
// risk_score field, swap callers over to that value directly.
// ------------------------------------------------------------------

export const SIGNAL_WEIGHTS: Record<SignalType, number> = {
  SHARED_DEVICE: 30,
  RAPID_MONEY_MOVEMENT: 30,
  CIRCULAR_TRANSACTION: 40,
  SUSPICIOUS_CONNECTION: 20,
  FRAUD_RING: 40,
}

export function computeIllustrativeScore(signalTypes: SignalType[]): number {
  const total = signalTypes.reduce((sum, t) => sum + (SIGNAL_WEIGHTS[t] ?? 0), 0)
  return Math.min(100, total)
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'CRITICAL'
  if (score >= 45) return 'HIGH'
  if (score >= 20) return 'MEDIUM'
  return 'LOW'
}

export function signalsForAccount(signals: FraudSignal[], accountId: string): FraudSignal[] {
  return signals.filter((s) => s.accounts.includes(accountId))
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  CRITICAL: '#e5484d',
  HIGH: '#f0883e',
  MEDIUM: '#e8b93a',
  LOW: '#3aa76d',
  INFO: '#2f6fed',
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  INFO: 'Info',
}
