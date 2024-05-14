// Keyspace has to be created so that the table can be created by Spring Data Cassandra
CREATE KEYSPACE IF NOT EXISTS BD WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

