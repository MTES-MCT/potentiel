create table if not exists domain_public_statistic.carto_projet_statistic (
  "identifiant" varchar not null primary key,
  "appelOffre" varchar not null,
  "dateNotification" timestamp,
  "departementProjet" varchar not null,
  "isFinancementParticipatif" boolean,
  "isInvestissementParticipatif" boolean,
  "puissance" decimal
);