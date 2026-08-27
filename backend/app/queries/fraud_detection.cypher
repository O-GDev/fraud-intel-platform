// Shared devices: a graph-native fraud signal that is awkward to express
// without repeatedly joining people, accounts, and device evidence.
MATCH (device:Device)<-[:USES]-(person:Person)
WITH device, collect(person) AS people
WHERE size(people) >= $minimum_people
RETURN
    device.id AS device_id,
    device.fingerprint AS fingerprint,
    [person IN people | person.id] AS person_ids,
    size(people) AS number_of_people
ORDER BY number_of_people DESC

// Multi-hop rapid movement: Account -> Transaction -> Account -> Transaction -> Account.
// The same shape is executed by FraudRepository.find_rapid_money_movement.
MATCH path =
    (start:Account)
    -[:SENDS]->(first:Transaction)
    -[:RECEIVED_BY]->(middle:Account)
    -[:SENDS]->(second:Transaction)
    -[:RECEIVED_BY]->(end:Account)
WHERE
    start <> end
    AND first.amount >= $minimum_amount
    AND second.amount >= $minimum_amount
    AND first.timestamp < second.timestamp
RETURN
    start.accountNumber AS source_account,
    middle.accountNumber AS intermediate_account,
    end.accountNumber AS destination_account,
    first.id AS first_transaction,
    second.id AS second_transaction,
    length(path) AS hops
ORDER BY first.timestamp

// Circular movement across three distinct accounts.
MATCH
    (first_account:Account)-[:SENDS]->(first_transaction:Transaction)
        -[:RECEIVED_BY]->(second_account:Account)
        -[:SENDS]->(second_transaction:Transaction)
        -[:RECEIVED_BY]->(third_account:Account)
        -[:SENDS]->(third_transaction:Transaction)
        -[:RECEIVED_BY]->(first_account)
WHERE
    first_account.id < second_account.id
    AND first_account.id < third_account.id
RETURN
    first_account.id AS account_1,
    second_account.id AS account_2,
    third_account.id AS account_3,
    [first_transaction.id, second_transaction.id, third_transaction.id] AS transactions