import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'pourcentageDCRDéposées';

export const cleanPourcentageDCRDéposées = cleanScalarStatistic(statisticType);

export const computePourcentageDCRDéposées = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          (select 
              count(p.key)
          from domain_views.projection p
          where 
              p.key like 'dossier-raccordement|%'
              and p.value->>'demandeComplèteRaccordement.accuséRéception.format' is not null
          )::decimal
        /        
          (select 
              count(p.key)
          from
              domain_views.projection p
          where 
              p.key like 'dossier-raccordement|%'
          )::decimal * 100    
      )
    )
    `,
    statisticType,
  );
