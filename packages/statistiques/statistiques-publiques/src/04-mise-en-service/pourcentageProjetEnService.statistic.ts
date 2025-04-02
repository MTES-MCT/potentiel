import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageProjetEnService';

export const computePourcentageProjetEnService = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT
          (
            (
              SELECT
                count(DISTINCT p.value ->> 'identifiantProjet')
              FROM
                domain_views.projection p
              WHERE
                p.key LIKE 'dossier-raccordement|%'
                AND p.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
            )::decimal / (
              SELECT
                count(DISTINCT (es.stream_id))
              FROM
                event_store.event_stream es
              WHERE
                es.type LIKE 'LauréatNotifié-V%'
                AND es.payload ->> 'identifiantProjet' NOT IN (
                  SELECT DISTINCT
                    (payload ->> 'identifiantProjet')
                  FROM
                    event_store.event_stream es
                  WHERE
                    es.type LIKE 'AbandonAccordé-V%'
                )
            )::decimal
          ) * 100
      )
    )
    `,
    statisticType,
  );
