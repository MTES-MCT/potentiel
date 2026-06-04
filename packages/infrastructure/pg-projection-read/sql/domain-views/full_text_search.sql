DROP TABLE IF EXISTS domain_views.search_config;
create table domain_views.search_config (
  projection_name varchar not null,
  key varchar not null,
  weight char(1) NOT NULL,
  primary key (projection_name, key)
)
insert into domain_views.search_config
values ('lauréat', 'nomProjet', 'A'),
  ('producteur', 'nom', 'B'),
  ('lauréat', 'localité.commune', 'C');


CREATE AGGREGATE tsvector_agg(tsvector) (
  STYPE = pg_catalog.tsvector,
  SFUNC = pg_catalog.tsvector_concat,
  INITCOND = ''
);

drop materialized view if exists domain_views.search_projects;

create materialized view domain_views.search_projects as
select projection.value->>'identifiantProjet' as id,
  tsvector_agg(
    to_tsvector(
      COALESCE(projection.value->>search_config.key, '')
    )
  ) as search
from domain_views.search_config
  inner join domain_views.projection on projection.key like format(
    '%s|%%',
    search_config.projection_name
  )
group by projection.value->>'identifiantProjet';

CREATE INDEX idx_search ON domain_views.search_projects USING gin (name gin_trgm_ops);