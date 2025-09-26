import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle = async (
  cycle: 'CRE4' | 'PPE2',
) => {
  const statisticType =
    cycle === 'PPE2'
      ? 'nombreTotalProjetPPE2AyantTransmisAttestationConformité'
      : 'nombreTotalProjetCRE4AyantTransmisAttestationConformité';

  await executeQuery(
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
          and p."value"->>'cycleAppelOffre' = $2
      )
    )
    `,
    statisticType,
    cycle,
  );
};
