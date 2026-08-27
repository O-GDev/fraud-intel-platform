from app.database.cogno import driver

BANKS = [
    {
        "id": "B001",
        "name": "Apex Bank",
        "code": "APEX"
    },
    {
        "id": "B002",
        "name": "Nova Bank",
        "code": "NOVA"
    },
    {
        "id": "B003",
        "name": "Unity Trust",
        "code": "UNITY"
    },
    {
        "id": "B004",
        "name": "Sterling Finance",
        "code": "STERLING"
    },
    {
        "id": "B005",
        "name": "Horizon Bank",
        "code": "HORIZON"
    }
]

PEOPLE = [
    {
        "id": "P001",
        "name": "Daniel Okafor",
        "phone": "08030000001",
        "email": "daniel@example.com"
    },
    {
        "id": "P002",
        "name": "Michael Adeyemi",
        "phone": "08030000002",
        "email": "michael@example.com"
    },
    {
        "id": "P003",
        "name": "Samuel Bello",
        "phone": "08030000003",
        "email": "samuel@example.com"
    },
    {
        "id": "P004",
        "name": "Grace Johnson",
        "phone": "08030000004",
        "email": "grace@example.com"
    },
    {
        "id": "P005",
        "name": "Tunde Ibrahim",
        "phone": "08030000005",
        "email": "tunde@example.com"
    },
    {
        "id": "P006",
        "name": "Victor James",
        "phone": "08030000006",
        "email": "victor@example.com"
    },
    {
        "id": "P007",
        "name": "Sarah Williams",
        "phone": "08030000007",
        "email": "sarah@example.com"
    },
    {
        "id": "P008",
        "name": "Emeka Obi",
        "phone": "08030000008",
        "email": "emeka@example.com"
    },
    {
        "id": "P009",
        "name": "Joseph Adams",
        "phone": "08030000009",
        "email": "joseph@example.com"
    },
    {
        "id": "P010",
        "name": "Linda Carter",
        "phone": "08030000010",
        "email": "linda@example.com"
    }
]

ACCOUNTS = [
    {
        "id": "A001",
        "accountNumber": "1000000001",
        "personId": "P001",
        "bankId": "B001",
        "accountType": "SAVINGS"
    },
    {
        "id": "A002",
        "accountNumber": "1000000002",
        "personId": "P001",
        "bankId": "B002",
        "accountType": "CURRENT"
    },
    {
        "id": "A003",
        "accountNumber": "1000000003",
        "personId": "P002",
        "bankId": "B003",
        "accountType": "SAVINGS"
    },
    {
        "id": "A004",
        "accountNumber": "1000000004",
        "personId": "P002",
        "bankId": "B001",
        "accountType": "CURRENT"
    },
    {
        "id": "A005",
        "accountNumber": "1000000005",
        "personId": "P003",
        "bankId": "B004",
        "accountType": "SAVINGS"
    },
    {
        "id": "A006",
        "accountNumber": "1000000006",
        "personId": "P004",
        "bankId": "B005",
        "accountType": "SAVINGS"
    },
    {
        "id": "A007",
        "accountNumber": "1000000007",
        "personId": "P005",
        "bankId": "B002",
        "accountType": "CURRENT"
    },
    {
        "id": "A008",
        "accountNumber": "1000000008",
        "personId": "P006",
        "bankId": "B003",
        "accountType": "SAVINGS"
    }
]

DEVICES = [
    {
        "id": "D001",
        "fingerprint": "fp-device-001",
        "deviceType": "MOBILE",
        "operatingSystem": "Android"
    },
    {
        "id": "D002",
        "fingerprint": "fp-device-002",
        "deviceType": "MOBILE",
        "operatingSystem": "iOS"
    },
    {
        "id": "D003",
        "fingerprint": "fp-device-003",
        "deviceType": "WEB",
        "operatingSystem": "Linux"
    },
    {
        "id": "D004",
        "fingerprint": "fp-device-004",
        "deviceType": "MOBILE",
        "operatingSystem": "Android"
    }
]

MERCHANTS = [
    {
        "id": "M001",
        "name": "QuickPay Electronics",
        "category": "ELECTRONICS",
        "status": "ACTIVE"
    },
    {
        "id": "M002",
        "name": "MarketHub Stores",
        "category": "RETAIL",
        "status": "ACTIVE"
    },
    {
        "id": "M003",
        "name": "Urban Logistics",
        "category": "LOGISTICS",
        "status": "ACTIVE"
    },
    {
        "id": "M004",
        "name": "Digital Services Ltd",
        "category": "SERVICES",
        "status": "ACTIVE"
    }
]

TRANSACTIONS = [
    {
        "id": "T020",
        "sourceAccountId": "A001",
        "targetAccountId": "A003",
        "amount": 2500000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "MOBILE_APP",
        "status": "COMPLETED",
        "timestamp": "2026-08-20T14:00:00",
        "deviceId": "D001",
        "merchantId": "M001"
    },

    {
        "id": "T021",
        "sourceAccountId": "A003",
        "targetAccountId": "A007",
        "amount": 2300000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "MOBILE_APP",
        "status": "COMPLETED",
        "timestamp": "2026-08-20T14:02:00",
        "deviceId": "D001",
        "merchantId": "M002"
    },

    {
        "id": "T022",
        "sourceAccountId": "A007",
        "targetAccountId": "A002",
        "amount": 2100000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "MOBILE_APP",
        "status": "COMPLETED",
        "timestamp": "2026-08-20T14:04:00",
        "deviceId": "D001",
        "merchantId": "M004"
    },

    {
        "id": "T030",
        "sourceAccountId": "A004",
        "targetAccountId": "A005",
        "amount": 800000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "WEB",
        "status": "COMPLETED",
        "timestamp": "2026-08-21T10:00:00",
        "deviceId": "D002",
        "merchantId": "M003"
    },

    {
        "id": "T031",
        "sourceAccountId": "A005",
        "targetAccountId": "A006",
        "amount": 760000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "WEB",
        "status": "COMPLETED",
        "timestamp": "2026-08-21T10:03:00",
        "deviceId": "D002",
        "merchantId": "M002"
    },

    {
        "id": "T032",
        "sourceAccountId": "A006",
        "targetAccountId": "A004",
        "amount": 720000,
        "currency": "NGN",
        "transactionType": "TRANSFER",
        "channel": "WEB",
        "status": "COMPLETED",
        "timestamp": "2026-08-21T10:06:00",
        "deviceId": "D002",
        "merchantId": "M001"
    }
]

def seed_banks():
    query = """
    MERGE (b:Bank {id: $id})
    SET
        b.name = $name,
        b.code = $code
    """

    with driver.session() as session:
        for bank in BANKS:
            session.run(query, **bank)

    print(f"Seeded {len(BANKS)} banks")

def seed_people():
    query = """
    MERGE (p:Person {id: $id})
    SET
        p.name = $name,
        p.phone = $phone,
        p.email = $email
    """

    with driver.session() as session:
        for person in PEOPLE:
            session.run(query, **person)

    print(f"Seeded {len(PEOPLE)} people")

def seed_accounts():
    query = """
    MATCH (p:Person {id: $personId})
    MATCH (b:Bank {id: $bankId})

    MERGE (a:Account {id: $id})

    SET
        a.accountNumber = $accountNumber,
        a.accountType = $accountType,
        a.status = "ACTIVE"

    MERGE (p)-[:OWNS]->(a)
    MERGE (b)-[:PROVIDES]->(a)
    """

    with driver.session() as session:
        for account in ACCOUNTS:
            session.run(query, **account)

    print(f"Seeded {len(ACCOUNTS)} accounts")

def seed_devices():
    query = """
    MERGE (d:Device {id: $id})
    SET
        d.fingerprint = $fingerprint,
        d.deviceType = $deviceType,
        d.operatingSystem = $operatingSystem
    """

    with driver.session() as session:
        for device in DEVICES:
            session.run(query, **device)

    print(f"Seeded {len(DEVICES)} devices")

PERSON_DEVICES = [
    {
        "personId": "P001",
        "deviceId": "D001"
    },
    {
        "personId": "P002",
        "deviceId": "D001"
    },
    {
        "personId": "P003",
        "deviceId": "D001"
    },
    {
        "personId": "P004",
        "deviceId": "D002"
    },
    {
        "personId": "P005",
        "deviceId": "D003"
    },
    {
        "personId": "P006",
        "deviceId": "D004"
    }
]

def seed_person_devices():
    query = """
    MATCH (p:Person {id: $personId})
    MATCH (d:Device {id: $deviceId})

    MERGE (p)-[:USES]->(d)
    """

    with driver.session() as session:
        for relationship in PERSON_DEVICES:
            session.run(query, **relationship)

    print(f"Created {len(PERSON_DEVICES)} person-device relationships")

def seed_merchants():
    query = """
    MERGE (m:Merchant {id: $id})
    SET
        m.name = $name,
        m.category = $category,
        m.status = $status
    """

    with driver.session() as session:
        for merchant in MERCHANTS:
            session.run(query, **merchant)

    print(f"Seeded {len(MERCHANTS)} merchants")

def seed_transactions():
    query = """
    MATCH (source:Account {id: $sourceAccountId})
    MATCH (target:Account {id: $targetAccountId})
    MATCH (device:Device {id: $deviceId})
    MATCH (merchant:Merchant {id: $merchantId})

    MERGE (t:Transaction {id: $id})

    SET
        t.amount = $amount,
        t.currency = $currency,
        t.transactionType = $transactionType,
        t.channel = $channel,
        t.status = $status,
        t.timestamp = datetime($timestamp)

    MERGE (source)-[:SENDS]->(t)
    MERGE (t)-[:RECEIVED_BY]->(target)
    MERGE (t)-[:USES_DEVICE]->(device)
    MERGE (t)-[:PAID_TO]->(merchant)
    """

    with driver.session() as session:
        for transaction in TRANSACTIONS:
            session.run(query, **transaction)

    print(f"Seeded {len(TRANSACTIONS)} transactions")

def seed_database():

    seed_banks()
    seed_people()
    seed_accounts()
    seed_devices()
    seed_person_devices()
    seed_merchants()
    seed_transactions()

    print()
    print("================================")
    print("Database seeded successfully!")
    print("================================")

if __name__ == "__main__":

    try:
        seed_database()

    except Exception as error:
        print("Database seeding failed.")
        print(error)

    finally:
        driver.close()