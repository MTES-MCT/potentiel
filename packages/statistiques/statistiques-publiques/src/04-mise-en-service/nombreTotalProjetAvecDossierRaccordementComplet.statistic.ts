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
          INNER JOIN domain_views.projection dr ON dr.value ->> 'identifiantProjet' = lau.value ->> 'identifiantProjet'
          LEFT JOIN domain_views.projection abandon ON abandon.key = format('abandon|%s', lau.value ->> 'identifiantProjet')
          AND abandon.value ->> 'estAbandonné' = 'true'
          LEFT JOIN domain_views.projection ppa ON ppa.key = format(
            'power-purchase-agreement|%s',
            lau.value ->> 'identifiantProjet'
          )
        WHERE
          lau.key LIKE 'lauréat|%'
          AND (
            abandon.key IS NULL
            OR ppa.key IS NOT NULL
          )
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
