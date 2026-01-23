import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getCountProjetsLauréatsNonAbandonnés } from '../_utils/getCountProjetsLauréatsNonAbandonnés.js';

const statisticType = 'pourcentageProjetEnService';

export const computePourcentageProjetEnService = async () => {
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
            (
              SELECT
                count(DISTINCT p.value ->> 'identifiantProjet')
              FROM
                domain_views.projection p
              WHERE
                p.key LIKE 'dossier-raccordement|%'
                AND p.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
            )::decimal / (
              ${getCountProjetsLauréatsNonAbandonnés}
            )::decimal
          ) * 100
      )
    )
    `,
    statisticType,
  );
};
