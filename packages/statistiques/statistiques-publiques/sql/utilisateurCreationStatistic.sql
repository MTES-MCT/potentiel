create table if not exists domain_public_statistic.utilisateur_creation_statistic (
  date timestamp primary key,
  sum varchar not null,
  count decimal not null
);
