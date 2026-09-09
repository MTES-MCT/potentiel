import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getQueryParams } from '#helpers';

export const computePuissanceTotaleMiseEnService = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'puissanceTotalePPE2MiseEnService'
      : 'puissanceTotaleCRE4MiseEnService'
    : 'puissanceTotaleMiseEnService';

  const params = getQueryParams(statisticType, cycle);

  await executeQuery(
    `
          insert
          into 
            domain_public_statistic.scalar_statistic
          values(
            $1, 
            (             
              with raccordements_en_service AS (
              select 
                distinct racc.value->>'identifiantProjet' as identifiantProjet
              from
                  domain_views.projection racc
              where 
                  racc.key like 'dossier-raccordement|%'
                  and value->>'miseEnService.dateMiseEnService' is not null
            )
            select
                  coalesce(sum((puiss.value->>'puissance')::float), 0)
              from
                  domain_views.projection racc
                  JOIN domain_views.projection ao ON split_part(racc.value ->> 'identifiantProjet', '#', 1) = ao.value ->> 'id'
                  inner join raccordements_en_service dossier on dossier.identifiantProjet = racc.value->>'identifiantProjet'
                  join domain_views.projection puiss on puiss.key=format('puissance|%s',racc.value->>'identifiantProjet')
              where 
                    racc.key like 'raccordement|%'
                    and racc.value->>'désactivé' is null
                    ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
              )
          )
          `,
    ...params,
  );
};
