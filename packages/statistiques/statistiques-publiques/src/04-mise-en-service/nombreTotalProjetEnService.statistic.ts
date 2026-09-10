import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getQueryParams } from '#helpers';

export const computeNombreTotalProjetEnService = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'nombreTotalProjetPPE2EnService'
      : 'nombreTotalProjetCRE4EnService'
    : 'nombreTotalProjetEnService';

  const params = getQueryParams(statisticType, cycle);

  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            count(distinct r.value->>'identifiantProjet')
        from
            domain_views.projection r
            join domain_views.projection ao ON split_part(r.value->>'identifiantProjet', '#', 1) = ao.value ->> 'id'
        where 
            r.key like 'raccordement|%'
            and r.value->>'désactivé' is null
            and r.value->>'miseEnService.date' is not null
            ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
      )
    )
    `,
    ...params,
  );
};
