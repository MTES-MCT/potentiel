import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalProjet';

export const computeNombreTotalProjet = () =>
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
          domain_views.projection 
        where key like 'candidature|%'
      )
    )
    `,
    statisticType,
  );
