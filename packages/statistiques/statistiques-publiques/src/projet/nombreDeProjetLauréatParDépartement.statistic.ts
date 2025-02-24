import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanCamembertStatistic } from '../_utils/cleanCamembertStatistic';

const statisticType = 'nombreDeProjetParDépartement';

export const cleanNombreDeProjetLauréatParDépartement = cleanCamembertStatistic(statisticType);

export const computeNombreDeProjetLauréatParDépartement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.carto_projet_statistic
    select 
      $1 as "type",
      concat("appelOffreId", '#', "periodeId", '#', "familleId", '#', "numeroCRE") as identifiant,
      jsonb_build_object(
        'appelOffreId', "appelOffreId",
        'periodeId', "periodeId",
        'familleId', "familleId",
        'numeroCRE', "numeroCRE",
        'notifiedOn', "notifiedOn",
        'departementProjet', "departementProjet",
        'isFinancementParticipatif', "isFinancementParticipatif",
        'isInvestissementParticipatif', "isInvestissementParticipatif"
    ) as value
    from "projects"
    where classe = 'Classé'
    and "abandonedOn" = 0
    `,
    statisticType,
  );
};
