import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getQueryParams } from '#helpers';

export const computeNombreTotalRéférencesRaccordement = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'nombreTotalRéférencesRaccordementPPE2'
      : 'nombreTotalRéférencesRaccordementCRE4'
    : 'nombreTotalRéférencesRaccordement';

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
	        count(distinct d.value->>'référence') 
        from domain_views.projection d 
        join domain_views.projection r on r."key" = format('raccordement|%s', d.value->>'identifiantProjet')
        join domain_views.projection ao ON ao.key = format('appel-offre|%s', SPLIT_PART(d.value ->> 'identifiantProjet', '#', 1))
        where 
          d.key like 'dossier-raccordement|%' 
          and r.value->>'désactivé' is null   
          ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
      )
    )
    `,
    ...params,
  );
};
