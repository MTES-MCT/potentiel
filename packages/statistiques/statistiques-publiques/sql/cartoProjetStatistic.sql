create table if not exists domain_public_statistic.carto_projet_statistic (
  identifiant varchar not null primary key,
  value jsonb not null
);