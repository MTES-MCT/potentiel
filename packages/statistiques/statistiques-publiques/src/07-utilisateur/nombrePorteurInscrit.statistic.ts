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
        select
          count(*)
        from
          "public"."users"
        where
          "public"."users"."role" = 'porteur-projet'
      )
    )
    `,
    statisticType,
  );
};
