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
              count(distinct d.value->>'identifiantProjet')::decimal
            FROM
              domain_views.projection d
              JOIN domain_views.projection r on r.key = format('raccordement|%s', d.value->>'identifiantProjet')
            WHERE
              r.value->>'désactivé' IS NULL
              AND d.key LIKE 'dossier-raccordement|%'
              AND d.value ->> 'demandeComplèteRaccordement.accuséRéception.format' IS NOT NULL
              AND d.value ->> 'propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format' IS NOT NULL
          )::decimal / (
            SELECT
              count(distinct d.value->>'identifiantProjet')
            FROM
              domain_views.projection d
              JOIN domain_views.projection r on r.key = format('raccordement|%s', d.value->>'identifiantProjet')  
            WHERE
              r.value->>'désactivé' IS NULL
              AND d.key LIKE 'dossier-raccordement|%'
              AND d.value ->> 'demandeComplèteRaccordement.accuséRéception.format' IS NOT NULL
          )::decimal * 100
    )
  )`,
    statisticType,
  );
};
