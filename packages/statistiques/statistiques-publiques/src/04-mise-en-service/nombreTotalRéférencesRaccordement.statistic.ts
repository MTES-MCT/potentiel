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
            count(distinct d.value->>'identifiantProjet') 
        from 
            domain_views.projection d
            join domain_views.projection r on r.key = format('raccordement|%s', d.value->>'identifiantProjet')
        where 
            d.key like 'dossier-raccordement|%'
            and r.value->>'désactivé' is null
      )
    )
    `,
    statisticType,
  );
};
