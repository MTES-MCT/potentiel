create table if not exists domain_public_statistic.carto_projet_statistic (
  identifiant varchar not null primary key,
  appel_offre varchar not null,
  date_notification timestamp,
  departement_projet varchar not null,
  is_financement_participatif boolean,
  is_investissement_participatif boolean,
  puissance decimal
);