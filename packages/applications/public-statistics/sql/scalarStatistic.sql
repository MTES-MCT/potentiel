create table if not exists domain_public_statistic.scalar_statistic (
  type varchar not null,
  value decimal not null
  primary key (type)
);