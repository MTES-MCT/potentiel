drop materialized view if exists domain_views.search_projects;

create materialized view domain_views.search_projects as
SELECT proj.value->>'identifiantProjet' AS id,
  SETWEIGHT(
    to_tsvector(
      COALESCE(
        proj.value->>'nomProjet',
        cand.value->>'nomProjet',
        ''
      )
    ),
    'A'
  ) || SETWEIGHT(
    to_tsvector(
      COALESCE(
        prod.value->>'nom',
        cand.value->>'nomCandidat',
        ''
      )
    ),
    'B'
  ) || SETWEIGHT(
    to_tsvector(
      COALESCE(
        rl.value->>'nomReprésentantLégal',
        cand.value->>'nomReprésentantLégal',
        ''
      )
    ),
    'B'
  ) || SETWEIGHT(
    to_tsvector(
      COALESCE(
        proj.value->>'localité.région',
        cand.value->>'localité.région',
        ''
      )
    ),
    'B'
  ) || SETWEIGHT(
    to_tsvector(
      COALESCE(
        proj.value->>'localité.département',
        cand.value->>'localité.département',
        ''
      )
    ),
    'B'
  ) as search
FROM domain_views.projection proj
  INNER JOIN domain_views.projection cand on cand.key = format(
    'candidature|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection prod on prod.key = format(
    'producteur|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection rl on rl.key = format(
    'représentant-légal|%s',
    proj.value->>'identifiantProjet'
  )
WHERE proj.key LIKE 'lauréat|%'
  OR proj.key LIKE 'éliminé|%';



select *
from domain_views.search_projects
where search @@ plainto_tsquery('Grand est');


DROP TABLE IF EXISTS domain_views.search_config;
create table domain_views.search_config (
  projection_name varchar not null,
  key varchar not null,
  weight char(1) NOT NULL,
  primary key (projection_name, key)
)
insert into domain_views.search_config
values ('lauréat', 'nomProjet', 'A'),
  ('producteur', 'nom', 'B');


CREATE AGGREGATE tsvector_agg(tsvector) (
  STYPE = pg_catalog.tsvector,
  SFUNC = pg_catalog.tsvector_concat,
  INITCOND = ''
);

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


select *
from domain_views.search_projects
select *
from domain_views.projection
where projection.value->>'identifiantProjet' is not null;


select *
from domain_views.search_config;

refresh materialized view domain_views.search_projects;
select *
from domain_views.search_projects;

SELECT p.key,
  p.value
from domain_views.projection p
  left join domain_views.search_projects s on s.id = SPLIT_PART(p.key, '|', 2)
where p.key LIKE 'cat1-b828fd5d|%'
CREATE OR REPLACE FUNCTION domain_views.refresh_search() RETURNS void SECURITY DEFINER AS $$ BEGIN REFRESH MATERIALIZED VIEW domain_views.search_projects with data;
RETURN;
END;
$$ LANGUAGE plpgsql;

GRANT SELECT ON domain_views.search_projects TO potentiel;

SELECT p.key,
  p.value
from domain_views.projection p -- inner join domain_views.search_projects s on s.id = SPLIT_PART(p.key, '|', 2)
where p.key LIKE 'cat1-ba5f480f|%'
  AND s.search @@ plainto_tsquery('ipsum')
select *
from domain_views.search_projects