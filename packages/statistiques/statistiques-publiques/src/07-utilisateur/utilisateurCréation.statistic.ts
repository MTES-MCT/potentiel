import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeUtilisateurCréation = async () => {
  await executeQuery(
    `
    INSERT
    into 
      domain_public_statistic.utilisateur_creation_statistic
    SELECT
      "source"."createdAt",
      COUNT(*),
      SUM(COUNT(*)) OVER (
        ORDER BY "source"."createdAt" ASC ROWS UNBOUNDED PRECEDING
      ) AS "count_2"
    FROM
      (
        SELECT
          DATE_TRUNC('month', "public"."users"."createdAt") AS "createdAt"
        FROM
          "public"."users"
      ) AS "source"
    WHERE
      "source"."createdAt" IS NOT NULL
    GROUP BY
      "source"."createdAt"
    ORDER BY
      "source"."createdAt" ASC
    `,
  );
};
