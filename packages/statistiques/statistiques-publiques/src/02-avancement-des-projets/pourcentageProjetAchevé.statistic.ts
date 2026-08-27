import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getCountProjetsLauréatsNonAbandonnés, getQueryParams } from '#helpers';

export const computePourcentageProjetAchevé = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'pourcentageProjetPPE2Achevé'
      : 'pourcentageProjetCRE4Achevé'
    : 'pourcentageProjetAchevé';

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
            select
              count(distinct(p.key))
            from domain_views.projection p
            join domain_views.projection ao
              on split_part(p.value->>'identifiantProjet', '#', 1) = ao.value->>'id'
            where
              p.key like 'achèvement|%'
              and p.value->>'estAchevé' = 'true'
              ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
          )::decimal / (
            ${getCountProjetsLauréatsNonAbandonnés(cycle)}
          )::decimal * 100
      )
    )
    `,
    ...params,
  );
};
