import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'totalPuissanceParAppelOffre';

export const computeTotalPuissanceParAppelOffre = async () => {
  await executeQuery(
    `
      insert
      into 
        domain_public_statistic.camembert_statistic
      select
        $1 as "type",
        value->>'appelOffre' as "category",
        sum(cast(value->>'puissance' as decimal)) as "value"
      from domain_views.projection
      where key like 'puissance|%'
      group by value->>'appelOffre'
    `,
    statisticType,
  );
};
