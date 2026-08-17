import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, countProjetsLauréatsNonAbandonnésSaufPPA, getQueryParams } from '#helpers';

export const computePourcentageProjetAvecDossierRaccordementComplet = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'pourcentageProjetPPE2AvecDossierRaccordementComplet'
      : 'pourcentageProjetCRE4AvecDossierRaccordementComplet'
    : 'pourcentageProjetAvecDossierRaccordementComplet';

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
              INNER JOIN domain_views.projection racc on racc.key = format('raccordement|%s', dr.value->>'identifiantProjet')
              WHERE
                  dr.key LIKE 'dossier-raccordement|%'
                  AND dr.value->>'demandeComplèteRaccordement.transmiseLe' IS NOT NULL
                  AND dr.value->>'miseEnService.transmiseLe' IS NOT null
                  AND (
                      dr.value->>'conventionDeRaccordementDirecte.dateSignature' IS NOT NULL
                    OR (
                      dr.value->>'conventionDeRaccordement.dateSignature' IS NOT NULL
                      AND dr.value->>'propositionTechniqueEtFinancière.dateSignature' IS NOT NULL
                    )
                  )
                  AND racc.value->>'désactivé' IS NULL
                  ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
            )::decimal / (
              ${countProjetsLauréatsNonAbandonnésSaufPPA(cycle)}
            )::decimal
          ) * 100
      )
    )
    `,
    ...params,
  );
};
