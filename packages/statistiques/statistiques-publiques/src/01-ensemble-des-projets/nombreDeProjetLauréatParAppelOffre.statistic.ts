import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreDeProjetLauréatParAppelOffre';

export const computeNombreDeProjetLauréatParAppelOffre = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.camembert_statistic
    select 
      $1 as "type",
      laur.value->>'appelOffre' AS "category", 
      count(*) AS "value"
    from 
      domain_views.projection laur
    where 
      laur.key  like 'lauréat|%'
    group by 1,2
    order by 1,2;
    `,
    statisticType,
  );
};
