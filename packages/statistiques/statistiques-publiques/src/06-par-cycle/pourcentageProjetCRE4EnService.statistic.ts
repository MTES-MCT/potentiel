import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getCountProjetsLauréatsNonAbandonnés } from '../_utils/getCountProjetsLauréatsNonAbandonnés';

const statisticType = 'pourcentageProjetCRE4EnService';

export const computePourcentageProjetCRE4EnService = async () => {
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
                count(DISTINCT p1.value ->> 'identifiantProjet')
              FROM
                domain_views.projection p1
                JOIN domain_views.projection p2 ON split_part(p1.value ->> 'identifiantProjet', '#', 1) = p2.value ->> 'id'
                AND p2.key LIKE 'appel-offre|%'
              WHERE
                p1.key LIKE 'dossier-raccordement|%'
                AND p1.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
                AND p2."value" ->> 'cycleAppelOffre' = 'CRE4'
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
