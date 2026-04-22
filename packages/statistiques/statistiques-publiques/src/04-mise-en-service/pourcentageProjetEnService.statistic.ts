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
                count(DISTINCT d.value ->> 'identifiantProjet')
              FROM
                domain_views.projection d
                join domain_views.projection r on r.key = format('raccordement|%s', d.value->>'identifiantProjet')
              WHERE
                d.key LIKE 'dossier-raccordement|%'
                AND d.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
                AND r.value->>'désactivé' IS NULL
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
