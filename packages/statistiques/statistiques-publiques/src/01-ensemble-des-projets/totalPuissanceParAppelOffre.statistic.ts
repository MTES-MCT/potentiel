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
      "public"."projects"."appelOffreId" as "category",
      sum("public"."projects"."puissance") as "value"
    from
      "public"."projects"
    where
      "public"."projects"."classe" = 'Classé'
    group by
      "public"."projects"."appelOffreId"
    order by
      "public"."projects"."appelOffreId" asc
    `,
    statisticType,
  );
};
