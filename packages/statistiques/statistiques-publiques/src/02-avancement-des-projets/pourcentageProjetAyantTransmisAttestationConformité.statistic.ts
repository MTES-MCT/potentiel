import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageProjetAyantTransmisAttestationConformité';

export const computePourcentageProjetAyantTransmisAttestationConformité = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT
        (
          SELECT
            count(DISTINCT (stream_id))::decimal
          FROM
            event_store.event_stream
          WHERE
            type LIKE 'AttestationConformitéTransmise-V%'
        ) * 100 / 
        (
        SELECT
          count(DISTINCT (es.stream_id))::decimal
        FROM
          event_store.event_stream es
          LEFT JOIN event_store.event_stream es2 ON es.payload ->> 'identifiantProjet' = es2.payload ->> 'identifiantProjet'
          AND es2."type" LIKE 'AbandonAccordé-V%'
        WHERE
          es.type LIKE 'LauréatNotifié-V%'
          AND es2.stream_id IS NULL
        )
      )
    )
    `,
    statisticType,
  );
};
