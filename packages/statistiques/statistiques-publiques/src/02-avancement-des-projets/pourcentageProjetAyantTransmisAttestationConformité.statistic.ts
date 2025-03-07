import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageProjetAyantTransmisAttestationConformité';

export const computePourcentageProjetAyantTransmisAttestationConformité = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select (
          select 
            count(distinct(stream_id))
          from event_store.event_stream 
          where type like 'AttestationConformitéTransmise-V%'
          ) * 100 
        / (
          select 
            count(distinct(es.stream_id))
          from event_store.event_stream es 
          left join event_store.event_stream es2 
            on es.payload->>'identifiantProjet' = es2.payload->>'identifiantProjet' 
            and es2."type" like 'AbandonAccordé-V%'
          where 
            es.type like 'LauréatNotifié-V%' and es2.stream_id is null
        )
      )
    )
    `,
    statisticType,
  );
