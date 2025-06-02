import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'totalPuissanceParAppelOffre';

export const computeTotalPuissanceParAppelOffre = async () => {
  await executeQuery(
    `
      INSERT
      INTO 
        domain_public_statistic.camembert_statistic
      SELECT
        $1 as "type",
        split_part(value->>'identifiantProjet', '#', 1) AS "category",
        sum(cast(value->>'puissance' AS decimal)) AS "value"
      FROM
        domain_views.projection
      WHERE
        KEY LIKE 'puissance|%'
      GROUP BY
        "category"
    `,
    statisticType,
  );
};
