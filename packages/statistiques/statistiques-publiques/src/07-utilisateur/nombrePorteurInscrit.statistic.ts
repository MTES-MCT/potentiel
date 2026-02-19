import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombrePorteurInscrit';

export const computeNombrePorteurInscrit = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT
        count(*) nb
        FROM
          domain_views.projection
        WHERE
          KEY LIKE 'utilisateur|%'
          AND VALUE ->> 'rôle' = 'porteur-projet
          AND VALUE ->> 'désactivé' IS NULL
      )
    )
    `,
    statisticType,
  );
};
