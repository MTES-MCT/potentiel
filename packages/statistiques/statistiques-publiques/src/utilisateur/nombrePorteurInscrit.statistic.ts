import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'nombrePorteurInscrit';

export const cleanNombrePorteurInscrit = cleanScalarStatistic(statisticType);

export const computeNombrePorteurInscrit = () =>
  executeQuery(
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
