-- Event Store
create schema domain_views;

create table domain_views.projection (
  key varchar primary key,
  value jsonb not null
);

insert into domain_views.projection
select split_part("key", '#', 1) || '|' || split_part("key", split_part("key", '#', 1) || '#', 2), "value" from "PROJECTION";
