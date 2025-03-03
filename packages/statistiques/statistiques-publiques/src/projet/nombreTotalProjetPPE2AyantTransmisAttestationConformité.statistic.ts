import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalProjetPPE2AyantTransmisAttestationConformité';

export const computeNombreTotalProjetPPE2AyantTransmisAttestationConformité = () =>
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
          and p."value"->>'cycleAppelOffre' = 'PPE2'
      )
    )
    `,
    statisticType,
  );
