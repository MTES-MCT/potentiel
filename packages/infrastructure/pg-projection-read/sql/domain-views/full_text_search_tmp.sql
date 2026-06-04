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
where search @@ plainto_tsquery('bordeaux');