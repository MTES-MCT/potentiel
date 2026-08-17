import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, countProjetsLauréatsNonAbandonnésSaufPPA, getQueryParams } from '#helpers';

export const computePourcentageProjetAvecDCRDéposée = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'pourcentageProjetPPE2AvecDCRDéposée'
      : 'pourcentageProjetCRE4AvecDCRDéposée'
    : 'pourcentageProjetAvecDCRDéposée';

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
              JOIN domain_views.projection r ON r.key = format(
                'raccordement|%s',
                d.value ->> 'identifiantProjet'
              )
              INNER JOIN domain_views.projection ao ON ao.key = format(
                'appel-offre|%s',
                SPLIT_PART(d.value ->> 'identifiantProjet', '#', 1)
              )
            WHERE
              d.key LIKE 'dossier-raccordement|%'
              AND d.value ->> 'demandeComplèteRaccordement.transmiseLe' IS NOT NULL
              AND r.value ->> 'désactivé' IS NULL
              ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
          )::decimal / (
            ${countProjetsLauréatsNonAbandonnésSaufPPA(cycle)}
          )::decimal * 100
      )
    )
    `,
    ...params,
  );
};
