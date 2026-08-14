import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { countProjetsPPE2LauréatsNonAbandonnésSaufPPA } from '#helpers';

const statisticType = 'pourcentageProjetPPE2AvecDossierRaccordementComplet';

export const computePourcentageProjetPPE2AvecDossierRaccordementComplet = async () => {
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
                count(distinct dr.value->>'identifiantProjet')
              FROM
                  domain_views.projection dr
              INNER join
              	domain_views.projection ao ON ao.key = format(
                'appel-offre|%s',
                SPLIT_PART(dr.value ->> 'identifiantProjet', '#', 1)
              )
              WHERE
                  dr.key LIKE 'dossier-raccordement|%'
                  AND ao.value->>'cycleAppelOffre' = 'PPE2'
                  AND dr.value->>'demandeComplèteRaccordement.transmiseLe' IS NOT NULL
                  AND dr.value->>'miseEnService.transmiseLe' IS NOT null
                  AND (
                    dr.value->>'conventionDeRaccordementDirecte.dateSignature' IS NOT NULL
                    OR (
                        dr.value->>'conventionDeRaccordement.dateSignature' IS NOT NULL
                        AND dr.value->>'propositionTechniqueEtFinancière.dateSignature' IS NOT NULL
                    )
                  )
            )::decimal / (
              ${countProjetsPPE2LauréatsNonAbandonnésSaufPPA}
            )::decimal
          ) * 100
      )
    )
    `,
    statisticType,
  );
};
