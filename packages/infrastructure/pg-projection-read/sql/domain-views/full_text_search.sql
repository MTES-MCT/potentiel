drop materialized view if exists domain_views.search_projects;
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
  ('lauréat', 'localité.commune', 'C');


CREATE EXTENSION IF NOT EXISTS pg_trgm;


DROP AGGREGATE IF EXISTS tsvector_agg(tsvector);

CREATE AGGREGATE tsvector_agg(tsvector) (
  STYPE = pg_catalog.tsvector,
  SFUNC = pg_catalog.tsvector_concat,
  INITCOND = ''
);


create materialized view domain_views.search_projects as
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
group by projection.value->>'identifiantProjet';

CREATE INDEX idx_search_projects_fts ON domain_views.search_projects USING gin (search);

CREATE INDEX idx_search_projects_fuzzy ON domain_views.search_projects USING gin (searchable_text gin_trgm_ops);

GRANT SELECT ON domain_views.search_projects TO potentiel;