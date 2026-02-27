create table if not exists domain_public_statistic.indicateurs_projets (
  appel_offres varchar not null,
  periode decimal not null,
  famille varchar,
  statut_projet varchar not null,
  region_projet varchar not null,
  departement_projet varchar not null,
  type_actionnariat varchar,
  date_de_notification timestamp,
  puissance_cumulee decimal,
  puissance_moyenne decimal,
  ecs_moyenne decimal
);