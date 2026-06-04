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
  AND s.search @@ plainto_tsquery('ipsum');


select *
from domain_views.search_projects
where search @@ plainto_tsquery('bordeaux');


set pg_trgm.similarity_threshold = 0.1;

select *
from domain_views.search_projects
where searchable_text like '%bodreaux%';
-- typo example
select *,
  similarity(searchable_text, 'bordux') as sim
from domain_views.search_projects
where similarity(searchable_text, 'bordux') > 0.1
order by sim desc;


set pg_trgm.similarity_threshold = 0.1;

with q as (
  select 'bordeux'::text as raw_query,
    -- typo input
    plainto_tsquery('simple', 'bordeux') as tsq
)
select sp.id,
  sp.searchable_text,
  ts_rank_cd(sp.search, q.tsq) as fts_rank,
  word_similarity(sp.searchable_text, q.raw_query) as trigram_rank,
  (
    0.7 * ts_rank_cd(sp.search, q.tsq) + 0.3 * word_similarity(sp.searchable_text, q.raw_query)
  ) as final_rank
from domain_views.search_projects sp
  cross join q
where sp.search @@ q.tsq
  or sp.searchable_text % q.raw_query
order by final_rank desc
limit 20;