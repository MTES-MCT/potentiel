import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeUtilisateurCréation = async () => {
  await executeQuery(
    `
    INSERT
    into 
      domain_public_statistic.utilisateur_creation_statistic
    SELECT
      DATE_TRUNC('month', ("value"->>'invitéLe')::timestamp) AS "createdAt",
      COUNT(*) AS "count",
      SUM(COUNT(*)) OVER (ORDER BY 1 ASC ROWS UNBOUNDED PRECEDING) AS "count_2"
    FROM
      "domain_views"."projection"
    WHERE key LIKE 'utilisateur|%'
      AND VALUE ->> 'désactivé' IS NULL
    GROUP BY 1
    ORDER BY 1 ASC;
    `,
  );
};
