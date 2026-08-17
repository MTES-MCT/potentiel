import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeNombreTotalProjetAchevé = async (cycle: 'CRE4' | 'PPE2') => {
  const statisticType =
    cycle === 'PPE2' ? 'nombreTotalProjetPPE2Achevé' : 'nombreTotalProjetCRE4Achevé';

  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(distinct(p.key)) 
        from domain_views.projection p 
        join domain_views.projection ao
          on split_part(p.value->>'identifiantProjet', '#', 1) = ao.value->>'id'
        where 
          p.key like 'achèvement|%'
          and p.value->>'estAchevé' = 'true'
          and ao.value->>'cycleAppelOffre' = $2
      )
    )
    `,
    statisticType,
    cycle,
  );
};
