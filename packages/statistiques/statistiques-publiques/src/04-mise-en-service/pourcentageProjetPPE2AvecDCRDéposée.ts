import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { countProjetsPPE2LauréatsNonAbandonnésSaufPPA } from '#helpers';

const statisticType = 'pourcentageProjetPPE2AvecDCRDéposée';

export const computePourcentageProjetPPE2AvecDCRDéposée = async () => {
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
              AND ao.value ->> 'cycleAppelOffre' = 'PPE2'
          )::decimal / (
            ${countProjetsPPE2LauréatsNonAbandonnésSaufPPA}
          )::decimal * 100
      )
    )
    `,
    statisticType,
  );
};
