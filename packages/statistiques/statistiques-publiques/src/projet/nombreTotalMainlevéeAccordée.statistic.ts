import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'nombreTotalMainlevéeAccordée';

export const cleanNombreTotalMainlevéeAccordée = cleanScalarStatistic(statisticType);

export const computeNombreTotalMainlevéeAccordée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(distinct(payload->>'identifiantProjet')) 
        from event_store.event_stream es 
          where es.type = 'DemandeMainlevéeGarantiesFinancièresAccordée-V1'
      )
    )
    `,
    statisticType,
  );
