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
            count(distinct d.value->>'identifiantProjet')
        from
            domain_views.projection d
            join domain_views.projection r on r.key = format('raccordement|%s', d.value->>'identifiantProjet')  
            join domain_views.projection ao ON split_part(d.value ->> 'identifiantProjet', '#', 1) = ao.value ->> 'id'
        where 
            d.key like 'dossier-raccordement|%'
            and d.value->>'miseEnService.dateMiseEnService' is not null
            and r.value->>'désactivé' is null
            ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
      )
    )
    `,
    ...params,
  );
};
