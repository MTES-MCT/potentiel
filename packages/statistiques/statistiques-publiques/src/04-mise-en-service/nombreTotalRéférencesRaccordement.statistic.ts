import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalRéférencesRaccordement';

export const computeNombreTotalRéférencesRaccordement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            count(p.key) 
        from 
            domain_views.projection p
        where 
            p.key like 'dossier-raccordement|%'
      )
    )
    `,
    statisticType,
  );
};
