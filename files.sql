CREATE schema document_store;
create TABLE document_store.files (
  key TEXT NOT NULL PRIMARY KEY,
  content BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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


select count(*)
from document_store.files
delete from document_store.files
where key like '%/candidature/import/%.json'