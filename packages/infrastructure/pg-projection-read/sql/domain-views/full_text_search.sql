DROP TABLE IF EXISTS domain_views.search_config;
create table domain_views.search_config (
  projection_name varchar not null,
  key varchar not null,
  weight char(1) NOT NULL,
  primary key (projection_name, key)
);

insert into domain_views.search_config
values ('lauréat', 'nomProjet', 'A'),
  ('producteur', 'nom', 'B'),
  ('lauréat', 'localité.commune', 'C'),
  ('accès', 'utilisateursAyantAccès', 'B');


CREATE EXTENSION IF NOT EXISTS pg_trgm;


DROP AGGREGATE IF EXISTS tsvector_agg(tsvector);

CREATE AGGREGATE tsvector_agg(tsvector) (
  STYPE = pg_catalog.tsvector,
  SFUNC = pg_catalog.tsvector_concat,
  INITCOND = ''
);



DROP TABLE IF EXISTS domain_views.search_projects;
create table domain_views.search_projects (
  id text primary key,
  search tsvector,
  searchable_text text
);


CREATE OR REPLACE PROCEDURE domain_views.refresh_search_projects(p_id text DEFAULT NULL) LANGUAGE plpgsql AS $$ BEGIN
insert into domain_views.search_projects
select projection.value->>'identifiantProjet' as id,
  tsvector_agg(
    setweight(
      to_tsvector(
        COALESCE(projection.value->>search_config.key, '')
      ),
      search_config.weight::"char"
    )
  ) as search,
  string_agg(
    NULLIF(
      COALESCE(projection.value->>search_config.key, ''),
      ''
    ),
    ' '
  ) as searchable_text
from domain_views.search_config
  inner join domain_views.projection on projection.key like format(
    '%s|%%',
    search_config.projection_name
  )
where projection.value->>'identifiantProjet' is not null
  AND(
    p_id IS NULL
    OR projection.value->>'identifiantProjet' = p_id
  )
group by projection.value->>'identifiantProjet' ON CONFLICT (id) DO
UPDATE
SET search = EXCLUDED.search,
  searchable_text = EXCLUDED.searchable_text;
END;
$$;

CREATE INDEX idx_search_projects_fts ON domain_views.search_projects USING gin (search);

CREATE INDEX idx_search_projects_fuzzy ON domain_views.search_projects USING gin (searchable_text gin_trgm_ops);

GRANT SELECT,
  INSERT,
  UPDATE ON domain_views.search_projects TO potentiel;