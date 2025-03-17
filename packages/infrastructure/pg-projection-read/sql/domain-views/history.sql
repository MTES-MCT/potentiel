create table if not exists domain_views.history (
  category varchar not null,
  id varchar not null,
  created_at varchar not null,
  type varchar not null,
  payload jsonb not null,
  primary key (category, id, created_at, type)
);
