from backend.app.services.fraud_service import FraudDetectionService


service = FraudDetectionService()


print("\n=== SHARED DEVICE SIGNALS ===")

shared_devices = service.detect_shared_devices()

for signal in shared_devices:
    print(signal)


print("\n=== RAPID MONEY MOVEMENT ===")

rapid_movements = service.detect_rapid_money_movement()

for movement in rapid_movements:
    print(movement)

print("\n=== TRANSACTIONS ===")

transactions = service.get_transactions()

for transaction in transactions:
    print(transaction)

print("\n=== CIRCULAR TRANSACTIONS ===")

circular_transactions = service.detect_circular_transactions()

for transaction in circular_transactions:
    print(transaction)

print("\n=== ALL FRAUD SIGNALS ===")

signals = service.detect_all_signals()

for signal in signals:
    print(signal)


print("\n=== ACCOUNT NETWORK ===")

network = service.investigate_accounts(
    ["A001", "A003", "A007"]
)

for item in network:
    print(item)

print("\n=== CONNECTED ACCOUNTS ===")

connected_accounts = service.find_connected_accounts(
    ["A001", "A003", "A007"]
)

for account in connected_accounts:
    print(account)

print("\n=== ACCOUNT INVESTIGATION ===")

investigation = service.investigate_account("A001")

print(investigation)