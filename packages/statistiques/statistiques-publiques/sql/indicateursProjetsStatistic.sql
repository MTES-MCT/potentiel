create table if not exists domain_public_statistic.indicateurs_projets (
  cycle_appel_offres varchar not null,
  appel_offres varchar not null,
  periode decimal not null,
  famille varchar,
  statut_projet varchar not null,
  region_projet varchar not null,
  departement_projet varchar not null,
  type_actionnariat varchar,
  date_de_notification timestamp not null,
  unite_puissance varchar not null,
  puissance_cumulee decimal not null,
  puissance_moyenne decimal not null,
  ecs_moyenne decimal not null, 
  nombre_de_projets decimal not null
);