# from backend.app.database.cogno import driver
#
#
# query = """
# MATCH (a:Account)-[r]->(target)
# RETURN
#     a.id AS source_account,
#     type(r) AS relationship,
#     labels(target) AS target_labels,
#     target.id AS target_id
# ORDER BY source_account
# """
#
# with driver.session() as session:
#     result = session.run(query)
#
#     for record in result:
#         print(record.data())

# from backend.app.database.cogno import driver
#
#
# query = """
# MATCH (t:Transaction)-[r]->(target)
# RETURN
#     t.id AS transaction_id,
#     type(r) AS relationship,
#     labels(target) AS target_labels,
#     target.id AS target_id
# ORDER BY transaction_id
# """
#
# with driver.session() as session:
#     result = session.run(query)
#
#     for record in result:
#         print(record.data())

# from backend.app.database.cogno import driver
#
# query = """
# MATCH (account:Account {id: $account_id})-[r]-(target)
# RETURN
#     startNode(r).id AS start_id,
#     type(r) AS relationship,
#     endNode(r).id AS end_id,
#     labels(target) AS target_labels,
#     target.id AS target_id,
#     target.name AS target_name
# """
#
# with driver.session() as session:
#     result = session.run(
#         query,
#         account_id="A001"
#     )
#
#     for record in result:
#         print(record.data())

# from backend.app.database.cogno import driver
# from backend.app.repositories.fraud_repository import FraudRepository
#
# repository = FraudRepository()
#
# result = repository.investigate_network("A001")
#
# for path in result:
#
#     print("\n=== NODES ===")
#
#     for node in path.nodes:
#         print({
#             "id": node.get("id"),
#             "labels": list(node.labels),
#             "properties": dict(node)
#         })
#
#     print("\n=== RELATIONSHIPS ===")
#
#     for relationship in path.relationships:
#         print({
#             "type": relationship.type,
#             "properties": dict(relationship)
#         })

from backend.app.repositories.fraud_repository import FraudRepository

repository = FraudRepository()

result = repository.investigate_network("A001")

print(result)