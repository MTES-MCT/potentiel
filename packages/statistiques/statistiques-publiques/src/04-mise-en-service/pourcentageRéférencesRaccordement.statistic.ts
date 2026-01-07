import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getCountProjetsLauréatsNonAbandonnés } from '../_utils/getCountProjetsLauréatsNonAbandonnés';

const statisticType = 'pourcentageRéféréncesRaccordement';

export const computePourcentageRéférencesRaccordement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT
        (
          SELECT
            count(p.key)
          FROM
            domain_views.projection p
          WHERE
            p.key LIKE 'dossier-raccordement|%'
        )::decimal / (
          ${getCountProjetsLauréatsNonAbandonnés}
        )::decimal * 100   
      )
    )
    `,
    statisticType,
  );
};
