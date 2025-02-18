import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'nombreParrainage';

export const cleanNombreParrainage = cleanScalarStatistic(statisticType);

export const computeNombreParrainage = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(distinct(users.email)) 
        from 
          notifications 
        inner join 
          users 
            on notifications.message ->> 'email' = users.email 
        where 
          type = 'project-invitation'
      )
    )
    `,
    statisticType,
  );
