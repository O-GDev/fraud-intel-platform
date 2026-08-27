from app.database.cogno import driver


class FraudRepository:
    def serialize_properties(self, properties):

        serialized = {}

        for key, value in properties.items():

            if hasattr(value, "iso_format"):
                serialized[key] = value.iso_format()

            else:
                serialized[key] = value

        return serialized

    def find_shared_devices(self):
        query = """
        MATCH (d:Device)<-[:USES]-(p:Person)

        WITH d, collect(p) AS people

        WHERE size(people) > 1

        RETURN
            d.id AS device_id,
            d.fingerprint AS fingerprint,
            [person IN people | person.name] AS people,
            size(people) AS number_of_people

        ORDER BY number_of_people DESC
        """

        with driver.session() as session:
            result = session.run(query)

            return [record.data() for record in result]

    def find_rapid_money_movement(self):
        query = """
        MATCH
            (source:Account)
            -[:SENDS]->(t1:Transaction)
            -[:RECEIVED_BY]->(middle:Account)
            -[:SENDS]->(t2:Transaction)
            -[:RECEIVED_BY]->(destination:Account)

        WHERE
            t1.amount >= $minimum_amount
            AND t2.amount >= $minimum_amount
            AND t1.timestamp < t2.timestamp

        RETURN
            source.id AS source_account,
            middle.id AS intermediate_account,
            destination.id AS destination_account,

            t1.id AS first_transaction,
            t2.id AS second_transaction,

            t1.amount AS first_amount,
            t2.amount AS second_amount,

            t1.timestamp AS first_timestamp,
            t2.timestamp AS second_timestamp

        ORDER BY first_timestamp
        """

        with driver.session() as session:
            result = session.run(
                query,
                minimum_amount=1_000_000
            )

            return [record.data() for record in result]

    def find_circular_transactions(self):
        query = """
        MATCH
            (a1:Account)
            -[:SENDS]->(t1:Transaction)
            -[:RECEIVED_BY]->(a2:Account)
            -[:SENDS]->(t2:Transaction)
            -[:RECEIVED_BY]->(a3:Account)
            -[:SENDS]->(t3:Transaction)
            -[:RECEIVED_BY]->(a1)

        WHERE
            a1 <> a2
            AND a2 <> a3
            AND a3 <> a1
            AND a1.id < a2.id
            AND a1.id < a3.id

        RETURN
            a1.id AS account_1,
            a2.id AS account_2,
            a3.id AS account_3,

            t1.id AS transaction_1,
            t2.id AS transaction_2,
            t3.id AS transaction_3,

            t1.amount AS amount_1,
            t2.amount AS amount_2,
            t3.amount AS amount_3,

            t1.timestamp AS timestamp_1,
            t2.timestamp AS timestamp_2,
            t3.timestamp AS timestamp_3
        """

        with driver.session() as session:
            result = session.run(query)

            return [record.data() for record in result]

    def get_transactions(self):
        query = """
        MATCH (source:Account)-[:SENDS]->(t:Transaction)-[:RECEIVED_BY]->(target:Account)
        RETURN
            source.id AS source_account,
            t.id AS transaction,
            target.id AS target_account,
            t.amount AS amount,
            t.timestamp AS timestamp
        ORDER BY timestamp
        """

        with driver.session() as session:
            result = session.run(query)

            return [record.data() for record in result]

    def find_account_details(self, account_ids):
        query = """
        MATCH (account:Account)
        WHERE account.id IN $account_ids

        OPTIONAL MATCH (person:Person)-[:OWNS]->(account)
        OPTIONAL MATCH (bank:Bank)-[:PROVIDES]->(account)
        OPTIONAL MATCH (person)-[:USES]->(device:Device)

        RETURN
            account.id AS account_id,
            account.accountNumber AS account_number,
            account.accountType AS account_type,

            person.id AS person_id,
            person.name AS person_name,
            person.phone AS person_phone,
            person.email AS person_email,

            bank.id AS bank_id,
            bank.name AS bank_name,
            bank.code AS bank_code,

            device.id AS device_id,
            device.fingerprint AS device_fingerprint,
            device.deviceType AS device_type,
            device.operatingSystem AS operating_system
        """

        with driver.session() as session:
            result = session.run(
                query,
                account_ids=account_ids
            )

            return [record.data() for record in result]

    def find_related_accounts(self, account_ids):
        query = """
        MATCH (account:Account)
        WHERE account.id IN $account_ids

        MATCH (person:Person)-[:OWNS]->(account)

        MATCH (person)-[:OWNS]->(related:Account)

        RETURN DISTINCT
            person.id AS person_id,
            person.name AS person_name,
            account.id AS source_account,
            related.id AS related_account
        """

        with driver.session() as session:
            result = session.run(
                query,
                account_ids=account_ids
            )

            return [record.data() for record in result]

    def find_connected_accounts(self, account_ids):
        query = """
        MATCH (start:Account)
        WHERE start.id IN $account_ids

        OPTIONAL MATCH
            (start)-[:SENDS]->(:Transaction)-[:RECEIVED_BY]->(connected:Account)

        OPTIONAL MATCH
            (start)<-[:OWNS]-(person:Person)-[:OWNS]->(related:Account)

        OPTIONAL MATCH
            (start)-[:SENDS]->(:Transaction)-[:USES_DEVICE]->(device:Device)
            <-[:USES_DEVICE]-(:Transaction)<-[:SENDS]-(device_account:Account)

        WITH start,
             collect(DISTINCT connected.id) AS transaction_accounts,
             collect(DISTINCT related.id) AS person_accounts,
             collect(DISTINCT device_account.id) AS device_accounts

        RETURN
            start.id AS account_id,
            transaction_accounts,
            person_accounts,
            device_accounts
        """

        with driver.session() as session:
            result = session.run(
                query,
                account_ids=account_ids
            )

            return [record.data() for record in result]

    def investigate_account(self, account_id):
        query = """
        MATCH (account:Account {id: $account_id})

        OPTIONAL MATCH (person:Person)-[:OWNS]->(account)

        OPTIONAL MATCH (bank:Bank)-[:PROVIDES]->(account)

        OPTIONAL MATCH (account)-[:SENDS]->(transaction:Transaction)
            -[:RECEIVED_BY]->(destination:Account)

        OPTIONAL MATCH (transaction)-[:USES_DEVICE]->(device:Device)

        RETURN
            account.id AS account_id,
            account.accountNumber AS account_number,
            account.accountType AS account_type,

            person.id AS person_id,
            person.name AS person_name,
            person.phone AS person_phone,
            person.email AS person_email,

            bank.id AS bank_id,
            bank.name AS bank_name,
            bank.code AS bank_code,

            collect(DISTINCT {
                id: transaction.id,
                amount: transaction.amount,
                currency: transaction.currency,
                type: transaction.transactionType,
                channel: transaction.channel,
                status: transaction.status,
                timestamp: transaction.timestamp,
                destination_account: destination.id
            }) AS transactions,

            collect(DISTINCT {
                id: device.id,
                fingerprint: device.fingerprint,
                type: device.deviceType,
                operating_system: device.operatingSystem
            }) AS devices
        """

        with driver.session() as session:
            result = session.run(
                query,
                account_id=account_id
            )

            record = result.single()

            if record is None:
                return None

            return record.data()

    def find_account_network(self, account_id):
        query = """
        MATCH
            (a1:Account {id: $account_id})
            -[:SENDS]->(t1:Transaction)
            -[:RECEIVED_BY]->(a2:Account)

        OPTIONAL MATCH
            (a2)-[:SENDS]->(t2:Transaction)
            -[:RECEIVED_BY]->(a3:Account)

        OPTIONAL MATCH
            (a3)-[:SENDS]->(t3:Transaction)
            -[:RECEIVED_BY]->(a4:Account)

        RETURN
            a1.id AS account_1,

            t1.id AS transaction_1,
            t1.amount AS amount_1,
            t1.timestamp AS timestamp_1,

            a2.id AS account_2,

            t2.id AS transaction_2,
            t2.amount AS amount_2,
            t2.timestamp AS timestamp_2,

            a3.id AS account_3,

            t3.id AS transaction_3,
            t3.amount AS amount_3,
            t3.timestamp AS timestamp_3,

            a4.id AS account_4
        """

        with driver.session() as session:
            result = session.run(
                query,
                account_id=account_id
            )

            return [record.data() for record in result]

    def investigate_network(self, account_id):

        query = """
        MATCH path =
            (start:Account {id: $account_id})
            -[:SENDS|RECEIVED_BY*1..6]->
            (end)

        RETURN path
        """

        with driver.session() as session:

            result = session.run(
                query,
                account_id=account_id
            )

            nodes = []
            edges = []

            for record in result:

                path = record["path"]

                # Extract nodes
                for node in path.nodes:

                    node_data = {
                        "id": node.get("id"),
                        "labels": list(node.labels),
                        "properties": self.serialize_properties(dict(node))
                    }

                    if node_data not in nodes:
                        nodes.append(node_data)

                # Extract relationships
                for relationship in path.relationships:

                    edge_data = {
                        "source": relationship.start_node.get("id"),
                        "target": relationship.end_node.get("id"),
                        "type": relationship.type
                    }

                    if edge_data not in edges:
                        edges.append(edge_data)

            return {
                "nodes": nodes,
                "edges": edges
            }