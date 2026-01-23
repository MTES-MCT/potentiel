import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageProjetAvecDCRQuiOntUnePTF';

export const computepourcentageProjetAvecDCRQuiOntUnePTF = async () => {
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
              count(distinct p.value->>'identifiantProjet')::decimal
            FROM
              domain_views.projection p
            WHERE
              p.key LIKE 'dossier-raccordement|%'
              AND p.value ->> 'demandeComplèteRaccordement.accuséRéception.format' IS NOT NULL
              AND p.value ->> 'propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format' IS NOT NULL
          )::decimal / (
            SELECT
              count(distinct p.value->>'identifiantProjet')
            FROM
              domain_views.projection p
            WHERE
              p.key LIKE 'dossier-raccordement|%'
              AND p.value ->> 'demandeComplèteRaccordement.accuséRéception.format' IS NOT NULL
          )::decimal * 100
    )
  )`,
    statisticType,
  );
};
