create table if not exists domain_public_statistic.camembert_statistic (
  type varchar not null,
  category varchar not null,
  value decimal not null,
  primary key (type, category)
);