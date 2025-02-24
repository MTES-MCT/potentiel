import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanProjetLauréatParDépartement = () =>
  executeQuery(
    `
    delete
    from domain_public_statistic.carto_projet_statistic
    `,
  );

export const computeProjetLauréatParDépartement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.carto_projet_statistic
    select 
      concat("appelOffreId", '#', "periodeId", '#', "familleId", '#', "numeroCRE") as identifiant,
      jsonb_build_object(
        'appelOffreId', "appelOffreId",
        'periodeId', "periodeId",
        'familleId', "familleId",
        'numeroCRE', "numeroCRE",
        'notifiedOn', "notifiedOn",
        'departementProjet', "departementProjet",
        'isFinancementParticipatif', "isFinancementParticipatif",
        'isInvestissementParticipatif', "isInvestissementParticipatif",
        'puissance', "puissance"
    ) as value
    from "projects"
    where classe = 'Classé'
    and "abandonedOn" = 0
    `,
  );
};
