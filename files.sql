CREATE schema document_store;
create TABLE document_store.files (
  key TEXT NOT NULL PRIMARY KEY,
  content BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);


truncate table document_store.files;

select key
from document_store.files;

GRANT USAGE ON SCHEMA document_store TO potentiel;
GRANT SELECT,
  INSERT,
  UPDATE,
  DELETE ON ALL TABLES IN SCHEMA document_store TO potentiel;
ALTER DEFAULT PRIVILEGES IN SCHEMA document_store
GRANT SELECT,
  INSERT,
  UPDATE,
  DELETE ON TABLES TO potentiel;


SELECT pg_size_pretty(
    pg_total_relation_size('"document_store"."files"')
  );


select *
from document_store.files
limit 1;
