import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeIndicateursProjetsAgrégés = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.indicateurs_projets
     select 
      "cycleAppelOffre" as "cycle_appel_offres",
      "appelOffre" as "appel_offres", 
      "periode", 
      "famille", 
      "statut" as "statut_projet",
      "region" as "region_projet", 
      "departement" as "departement_projet",
      "typeActionnariat" as "type_actionnariat",
      "dateNotification" as "date_de_notification", 
      SUM("puissance") as "puissance_cumulee",
      AVG("puissance") as "puissance_moyenne",
      AVG("evaluationCarbone") as "ecs_moyenne",
      count(*) as "nombre_de_projets"
    from 
      domain_views.stats_projets
    group by 
       "cycleAppelOffre", "appelOffre", "periode", "famille", "statut", "region", "departement", "dateNotification", "typeActionnariat"
    order by 
       "cycleAppelOffre", "appelOffre", "periode", "famille", "statut", "region", "departement", "dateNotification", "typeActionnariat";
    `,
  );
};
