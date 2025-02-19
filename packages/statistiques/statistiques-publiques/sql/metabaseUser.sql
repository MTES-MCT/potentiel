CREATE USER metabase WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA domain_public_statistic TO metabase;
GRANT SELECT ON ALL TABLES IN SCHEMA domain_public_statistic TO metabase;
ALTER DEFAULT PRIVILEGES IN SCHEMA domain_public_statistic GRANT SELECT ON TABLES TO metabase;
