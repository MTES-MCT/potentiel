import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'totalPuissanceProjetAvecMainlevéeAccordée';

export const cleanTotalPuissanceProjetAvecMainlevéeAccordée = cleanScalarStatistic(statisticType);

export const computeTotalPuissanceProjetAvecMainlevéeAccordée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
	        sum(p."puissance") as "value" 
        from projects p
        join event_store.event_stream es 
	        on es.payload->>'identifiantProjet' = p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"
        where es."type" = 'DemandeMainlevéeGarantiesFinancièresAccordée-V1'
      )
    )
    `,
    statisticType,
  );
