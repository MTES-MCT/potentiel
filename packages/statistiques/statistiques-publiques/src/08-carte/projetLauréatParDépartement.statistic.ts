import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeProjetLauréatParDépartement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.carto_projet_statistic
    select
      concat("appelOffreId", '#', "periodeId", '#', "familleId", '#', "numeroCRE") as identifiant,
      "appelOffreId" as "appelOffre",
      TO_TIMESTAMP(("notifiedOn")::BIGINT / 1000)::DATE as "dateNotification",
      "departementProjet",
      "isFinancementParticipatif",
      "isInvestissementParticipatif",
      "puissance"
    from "projects"
    where 
      classe = 'Classé'
      and "abandonedOn" = 0
    `,
  );
};
