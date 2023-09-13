create or replace view system_views.stream_category as
  select category, count(id) 
  from system_views.stream_info 
  group by category 
  order by category;