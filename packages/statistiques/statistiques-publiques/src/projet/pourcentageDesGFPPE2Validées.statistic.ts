import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'pourcentageDesGFPPE2Validées';

export const cleanPourcentageDesGFPPE2Validées = cleanScalarStatistic(statisticType);

export const computePourcentageDesGFPPE2Validées = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT CAST(
            (
                (
                    SELECT COUNT(distinct(p.id))
                    FROM projects p
                    inner join domain_views.projection gf on gf.value->>'identifiantProjet' = p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"
                                      and key LIKE 'garanties-financieres|%' 
                    where p."classe" = 'Classé'
                    AND p."abandonedOn" = 0
                    AND p."appelOffreId" LIKE '%PPE2%'
                    AND gf.value->>'garantiesFinancières.statut' IN ('validé', 'levé')

                ) * 100.0
            ) / (
                SELECT COUNT(p.id)
                FROM projects p
                    JOIN domain_views.projection ao ON ao.key = 'appel-offre|' || p."appelOffreId"
                WHERE 
                -- Soit 'soumisAuxGarantiesFinancieres' est au niveau de l'AO (car par de famille)
                (("value"->>'soumisAuxGarantiesFinancieres' <> 'non soumis' AND "familleId" = '')
                -- Soit on a une famille et on va chercher le 'soumisAuxGarantiesFinancieres' de cette famille
                        OR ("familleId" <> ''
                            AND ((((ao.value->>'periodes')::json -> p."periodeId"::int-1)->'familles')::json -> p."familleId"::int-1)->>'soumisAuxGarantiesFinancieres' <> 'non soumis'))
                    AND "classe" = 'Classé'
                    AND "abandonedOn" = 0
                    AND "appelOffreId" LIKE '%PPE2%'
            ) AS DECIMAL(10,2)
        )
      )
    )
    `,
    statisticType,
  );
