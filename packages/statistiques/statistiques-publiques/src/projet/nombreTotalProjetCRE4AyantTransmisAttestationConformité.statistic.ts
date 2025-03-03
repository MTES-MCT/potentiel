import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'nombreTotalProjetCRE4AyantTransmisAttestationConformité';

export const cleanNombreTotalProjetCRE4AyantTransmisAttestationConformité =
  cleanScalarStatistic(statisticType);

export const computeNombreTotalProjetCRE4AyantTransmisAttestationConformité = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select count(distinct(es.stream_id))
        from event_store.event_stream es 
        join domain_views.projection p 
          on split_part(es.payload->>'identifiantProjet', '#', 1) = p.value->>'id'
        where 
          es."type" like 'AttestationConformitéTransmise-V%' 
          and p."key" like 'appel-offre|%'
          and p."value"->>'cycleAppelOffre' = 'CRE4'
      )
    )
    `,
    statisticType,
  );
