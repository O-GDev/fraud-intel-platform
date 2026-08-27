from datetime import timedelta
from app.repositories.fraud_repository import FraudRepository
from app.models.risk_signal import RiskSignal
from app.models.fraud_ring import FraudRing


class FraudDetectionService:

    def __init__(self):
        self.repository = FraudRepository()

    def detect_shared_devices(self):

        results = self.repository.find_shared_devices()

        signals = []

        for result in results:
            signal = RiskSignal(
                signal_type="SHARED_DEVICE",
                severity="HIGH",
                score=70,
                description=(
                    f"{result['number_of_people']} people are associated "
                    f"with the same device."
                ),
                evidence=result
            )

            signals.append(signal)

        return signals

    def detect_rapid_money_movement(self):

        movements = self.repository.find_rapid_money_movement()

        signals = []

        max_seconds = 10 * 60

        for movement in movements:

            first_time = movement["first_timestamp"].to_native()
            second_time = movement["second_timestamp"].to_native()

            time_difference = second_time - first_time

            seconds = time_difference.total_seconds()

            if seconds <= max_seconds:
                movement["time_difference_seconds"] = seconds

                signal = RiskSignal(
                    signal_type="RAPID_MONEY_MOVEMENT",
                    severity="HIGH",
                    score=80,
                    description=(
                        f"Money moved rapidly from "
                        f"{movement['source_account']} through "
                        f"{movement['intermediate_account']} to "
                        f"{movement['destination_account']}."
                    ),
                    evidence=movement
                )

                signals.append(signal)

        return signals

    def detect_circular_transactions(self):

        movements = self.repository.find_circular_transactions()

        signals = []

        for movement in movements:
            signal = RiskSignal(
                signal_type="CIRCULAR_TRANSACTION",
                severity="CRITICAL",
                score=90,
                description=(
                    f"Circular money movement detected across "
                    f"{movement['account_1']}, "
                    f"{movement['account_2']}, and "
                    f"{movement['account_3']}."
                ),
                evidence=movement
            )

            signals.append(signal)

        return signals

    def get_transactions(self):
        return self.repository.get_transactions()

    def detect_all_signals(self):

        signals = []

        signals.extend(self.detect_shared_devices())
        signals.extend(self.detect_rapid_money_movement())
        signals.extend(self.detect_circular_transactions())

        return signals

    def investigate_accounts(self, account_ids):

        return self.repository.find_account_details(account_ids)

    def calculate_risk_score(self, signals):

        if not signals:
            return 0

        highest_score = max(signal.score for signal in signals)

        supporting_signals = len(signals) - 1

        score = highest_score + (supporting_signals * 10)

        return min(score, 100)

    def determine_severity(self, score):

        if score >= 90:
            return "CRITICAL"

        if score >= 70:
            return "HIGH"

        if score >= 40:
            return "MEDIUM"

        return "LOW"

    def build_fraud_ring(self, signals):

        if not signals:
            return None

        risk_score = self.calculate_risk_score(signals)

        severity = self.determine_severity(risk_score)

        return FraudRing(
            ring_id="RING-001",
            risk_score=risk_score,
            severity=severity,
            signals=signals
        )

    def analyze_fraud(self):

        signals = self.detect_all_signals()

        fraud_ring = self.build_fraud_ring(signals)

        return fraud_ring

    def find_connected_accounts(self, account_ids):

        return self.repository.find_connected_accounts(account_ids)

    def investigate_account(self, account_id):

        return self.repository.investigate_account(account_id)


    def calculate_risk(self):

        shared_devices = self.detect_shared_devices()
        rapid_movements = self.detect_rapid_money_movement()
        circular_transactions = self.detect_circular_transactions()

        score = 0
        reasons = []

        if shared_devices:
            score += 25
            reasons.append(
                "Multiple people are using the same device."
            )

        if rapid_movements:
            score += 35
            reasons.append(
                "Funds are moving rapidly between multiple accounts."
            )

        if circular_transactions:
            score += 40
            reasons.append(
                "Funds are moving through circular transaction patterns."
            )

        if score >= 75:
            level = "CRITICAL"
        elif score >= 50:
            level = "HIGH"
        elif score >= 25:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "score": score,
            "level": level,
            "reasons": reasons
        }

    def get_dashboard(self):

        shared_devices = self.detect_shared_devices()

        rapid_movements = self.detect_rapid_money_movement()

        circular_transactions = self.detect_circular_transactions()

        risk_assessment = self.calculate_risk()
        return {
            "summary": {
                "shared_device_signals": len(shared_devices),
                "rapid_money_movements": len(rapid_movements),
                "circular_transactions": len(circular_transactions)
            },
    "risk_assessment": risk_assessment,

            "risk_signals": {
                "shared_devices": shared_devices,
                "rapid_money_movements": rapid_movements,
                "circular_transactions": circular_transactions
            }
        }

    def get_account_network(self, account_id):
        return self.repository.find_account_network(account_id)
