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
      "appelOffreId" AS "category", 
      count(*) AS "value"
    from 
      "projects"
    where 
      "classe" = 'Classé' and 
      "notifiedOn"!='0' 
    group by "appelOffreId"
    order by "appelOffreId" asc
    `,
    statisticType,
  );
};
