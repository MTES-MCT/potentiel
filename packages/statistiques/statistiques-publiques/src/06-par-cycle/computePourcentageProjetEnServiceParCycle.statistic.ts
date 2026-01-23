import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getCountProjetsLauréatsNonAbandonnésParCycle } from '../_utils/getCountProjetsLauréatsNonAbandonnés.js';

export const computePourcentageProjetEnServiceParCycle = async (cycle: 'PPE2' | 'CRE4') => {
  const statisticType =
    cycle === 'PPE2' ? 'pourcentageProjetPPE2EnService' : 'pourcentageProjetCRE4EnService';

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
                AND p2."value" ->> 'cycleAppelOffre' = $2
            )::decimal / (
              ${getCountProjetsLauréatsNonAbandonnésParCycle}
            )::decimal
          ) * 100
      )
    )
    `,
    statisticType,
    cycle,
  );
};
