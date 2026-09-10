import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getCountProjetsLauréatsNonAbandonnésSaufPPA, getQueryParams } from '#helpers';

export const computePourcentageProjetQuiOntAuMoinsUneRéférenceDeRaccordement = async (
  cycle?: Cycle,
) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'pourcentageProjetPPE2QuiOntAuMoinsUneRéférenceDeRaccordement'
      : 'pourcentageProjetCRE4QuiOntAuMoinsUneRéférenceDeRaccordement'
    : 'pourcentageProjetQuiOntAuMoinsUneRéférenceDeRaccordement';

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
          SELECT
            count(distinct d.value->>'identifiantProjet')
          FROM
            domain_views.projection d
           join domain_views.projection r on r."key" = format('raccordement|%s', d.value->>'identifiantProjet')
           join domain_views.projection ao ON ao.key = format('appel-offre|%s', SPLIT_PART(d.value ->> 'identifiantProjet', '#', 1))
          WHERE
            d.key LIKE 'dossier-raccordement|%'
            AND r.value->>'désactivé' IS NULL
            ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
        )::decimal / (
          ${getCountProjetsLauréatsNonAbandonnésSaufPPA(cycle)}
        )::decimal * 100   
      )
    )
    `,
    ...params,
  );
};
