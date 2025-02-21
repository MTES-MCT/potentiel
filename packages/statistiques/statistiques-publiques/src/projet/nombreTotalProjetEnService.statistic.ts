import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'nombreTotalProjetEnService';

export const cleanNombreTotalProjetEnService = cleanScalarStatistic(statisticType);

export const computeNombreTotalProjetEnService = () =>
  executeQuery(
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
            and p.value->>'miseEnService.dateMiseEnService' is not null
      )
    )
    `,
    statisticType,
  );
