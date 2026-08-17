import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getCountProjetsLauréatsNonAbandonnés, getQueryParams } from '#helpers';

export const computePourcentageProjetEnService = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'pourcentageProjetPPE2EnService'
      : 'pourcentageProjetCRE4EnService'
    : 'pourcentageProjetEnService';

  const params = getQueryParams(statisticType, cycle);

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
                JOIN domain_views.projection ao ON split_part(p1.value ->> 'identifiantProjet', '#', 1) = ao.value ->> 'id'
                AND ao.key LIKE 'appel-offre|%'
                join domain_views.projection racc on racc.key = format('raccordement|%s', p1.value->>'identifiantProjet')
              WHERE
                p1.key LIKE 'dossier-raccordement|%'
                AND p1.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
                AND racc.value->>'désactivé' IS NULL
                ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
            )::decimal / (
              ${getCountProjetsLauréatsNonAbandonnés(cycle)}
            )::decimal
          ) * 100
      )
    )
    `,
    ...params,
  );
};
