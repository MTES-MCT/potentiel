import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalDemande';

export const computeNombreTotalDemande = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    select
      $1, 
      count(*)
    from domain_views.stats_demandes;
    `,
    statisticType,
  );
};
