from backend.app.database.cogno import driver


QUERY = """
MATCH (p:Person {id: $person_id})
      -[:OWNS]->
      (a:Account)
      <-[:PROVIDES]-
      (b:Bank)

RETURN
    p.id AS person_id,
    p.name AS person_name,
    a.accountNumber AS account_number,
    a.accountType AS account_type,
    b.name AS bank_name,
    b.code AS bank_code
ORDER BY bank_name
"""


def find_person_accounts(person_id):

    with driver.session() as session:

        result = session.run(
            QUERY,
            person_id=person_id
        )

        return result.data()


if __name__ == "__main__":

    try:

        accounts = find_person_accounts("P001")

        for account in accounts:
            print(account)

    finally:
        driver.close()