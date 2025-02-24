create table if not exists domain_public_statistic.carto_projet_statistic (
  type varchar not null,
  identifiant varchar not null,
  value jsonb not null,
  primary key (type, identifiant)
);