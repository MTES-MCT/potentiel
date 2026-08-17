import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getQueryParams } from '#helpers';

export const computeNombreTotalProjetAvecDCRDéposée = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'nombreTotalProjetPPE2AvecDCRDéposée'
      : 'nombreTotalProjetCRE4AvecDCRDéposée'
    : 'nombreTotalProjetAvecDCRDéposée';

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
            INNER JOIN domain_views.projection ao ON ao.key = format(
              'appel-offre|%s',
              SPLIT_PART(d.value ->> 'identifiantProjet', '#', 1)
            )
        where 
            d.key like 'dossier-raccordement|%'
            and d.value->>'demandeComplèteRaccordement.transmiseLe' is not null
            and r.value->>'désactivé' is null
            ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
      )
    )
    `,
    ...params,
  );
};
