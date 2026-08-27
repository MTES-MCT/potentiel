import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { type Cycle, getQueryParams } from '#helpers';

export const computeNombreTotalProjetAvecDossierRaccordementComplet = async (cycle?: Cycle) => {
  const statisticType = cycle
    ? cycle === 'PPE2'
      ? 'nombreTotalProjetPPE2AvecDossierRaccordementComplet'
      : 'nombreTotalProjetCRE4AvecDossierRaccordementComplet'
    : 'nombreTotalProjetAvecDossierRaccordementComplet';

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
          count(*)
        FROM
          domain_views.projection lau
          INNER JOIN domain_views.projection racc on racc.key = format('raccordement|%s', lau.value->>'identifiantProjet')
          INNER JOIN domain_views.projection ao ON ao.key = format(
            'appel-offre|%s',
            SPLIT_PART(lau.value ->> 'identifiantProjet', '#', 1)
          )
          INNER JOIN domain_views.projection dr ON dr.key like 'dossier-raccordement|%' and dr.value ->> 'identifiantProjet' = lau.value ->> 'identifiantProjet'
        WHERE
          lau.key LIKE 'lauréat|%'
          AND dr.value ->> 'demandeComplèteRaccordement.transmiseLe' IS NOT NULL
          AND dr.value ->> 'miseEnService.transmiseLe' IS NOT NULL
          AND (
            dr.value ->> 'conventionDeRaccordementDirecte.dateSignature' IS NOT NULL
            OR (
              dr.value ->> 'conventionDeRaccordement.dateSignature' IS NOT NULL
              AND dr.value ->> 'propositionTechniqueEtFinancière.dateSignature' IS NOT NULL
            )
          )
          AND racc.value->>'désactivé' IS NULL
            ${cycle ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
      )
    )
    `,
    ...params,
  );
};
