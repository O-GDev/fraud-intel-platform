from app.database.cogno import driver

CONSTRAINTS = [

    """
    CREATE CONSTRAINT person_id_unique IF NOT EXISTS
    FOR (p:Person)
    REQUIRE p.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT person_phone_unique IF NOT EXISTS
    FOR (p:Person)
    REQUIRE p.phone IS UNIQUE
    """,

    """
    CREATE CONSTRAINT person_email_unique IF NOT EXISTS
    FOR (p:Person)
    REQUIRE p.email IS UNIQUE
    """,

    """
    CREATE CONSTRAINT bank_id_unique IF NOT EXISTS
    FOR (b:Bank)
    REQUIRE b.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT bank_code_unique IF NOT EXISTS
    FOR (b:Bank)
    REQUIRE b.code IS UNIQUE
    """,

    """
    CREATE CONSTRAINT account_id_unique IF NOT EXISTS
    FOR (a:Account)
    REQUIRE a.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT account_number_unique IF NOT EXISTS
    FOR (a:Account)
    REQUIRE a.accountNumber IS UNIQUE
    """,

    """
    CREATE CONSTRAINT transaction_id_unique IF NOT EXISTS
    FOR (t:Transaction)
    REQUIRE t.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT device_id_unique IF NOT EXISTS
    FOR (d:Device)
    REQUIRE d.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT device_fingerprint_unique IF NOT EXISTS
    FOR (d:Device)
    REQUIRE d.fingerprint IS UNIQUE
    """,

    """
    CREATE CONSTRAINT merchant_id_unique IF NOT EXISTS
    FOR (m:Merchant)
    REQUIRE m.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT risk_signal_id_unique IF NOT EXISTS
    FOR (r:RiskSignal)
    REQUIRE r.id IS UNIQUE
    """,

    """
    CREATE CONSTRAINT fraud_ring_id_unique IF NOT EXISTS
    FOR (f:FraudRing)
    REQUIRE f.id IS UNIQUE
    """
]


def create_constraints():

    with driver.session() as session:

        for constraint in CONSTRAINTS:
            session.run(constraint)

    print("All constraints created.")


if __name__ == "__main__":

    try:
        create_constraints()

    finally:
        driver.close()
