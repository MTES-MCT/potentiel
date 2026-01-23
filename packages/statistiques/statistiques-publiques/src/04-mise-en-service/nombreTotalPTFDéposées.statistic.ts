import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalPTFDéposées';

export const computeNombreTotalPTFDéposées = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            count(distinct p.value->>'identifiantProjet')
        from
            domain_views.projection p
        where 
            p.key like 'dossier-raccordement|%'
            and p.value->>'propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format' is not null
      )
    )
    `,
    statisticType,
  );
};
