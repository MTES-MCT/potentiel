-- Event Store
create schema app_views;

create table app_views.projection (
  key varchar primary key,
  value jsonb not null
);

insert into app_views.projection
select split_part("key", '#', 1) || '|' || split_part("key", split_part("key", '#', 1) || '#', 2), "value" from "PROJECTION";
