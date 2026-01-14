import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreDeDemandeParCategorie';

export const computeNombreDeDemandeParCategorie = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.camembert_statistic
    select
      $1,
     categorie,
     count(*)
    from domain_views.stats_demandes
    group by categorie;
    `,
    statisticType,
  );
};
