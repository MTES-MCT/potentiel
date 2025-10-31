import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageAttestationTéléchargée';

export const computePourcentageAttestationTéléchargée = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT 100 * COUNT(distinct stat.données->>'projet')::decimal / COUNT(distinct cand.value->>'identifiantProjet')
        FROM domain_views.projection cand
          LEFT join "statistiquesUtilisation" stat on stat.type = 'attestationTéléchargée'
          and format(
            '%s#%s#%s#%s',
            stat.données->'projet'->>'appelOffreId',
            stat.données->'projet'->>'periodeId',
            stat.données->'projet'->>'familleId',
            stat.données->'projet'->>'numeroCRE'
          ) = cand.value->>'identifiantProjet'
        WHERE key like 'candidature|%'
          AND DATE((value->>'notification.notifiéeLe')::timestamp) >= DATE ('2020-04-15')
      )
    )
    `,
    statisticType,
  );
};
