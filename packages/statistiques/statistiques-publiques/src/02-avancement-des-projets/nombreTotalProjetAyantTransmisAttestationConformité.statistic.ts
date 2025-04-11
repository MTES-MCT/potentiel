import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalProjetAyantTransmisAttestationConformité';

export const computeNombreTotalProjetAyantTransmisAttestationConformité = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(distinct(stream_id))
        from event_store.event_stream 
          where type like 'AttestationConformitéTransmise-V%'
      )
    )
    `,
    statisticType,
  );
};
