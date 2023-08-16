create schema analytic_views

create view statistics as
select si.category,
       si.id,
       p.value,
       si.created_at,
       si.updated_at
from domain_views.projection p
join system_views.stream_info si on p.key = (si.category || '|' || si.id);