import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageProjetPPE2EnService';

export const computePourcentageProjetPPE2EnService = () =>
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
                count(DISTINCT p1.value ->> 'identifiantProjet')
              FROM
                domain_views.projection p1
                JOIN domain_views.projection p2 ON split_part(p1.value ->> 'identifiantProjet', '#', 1) = p2.value ->> 'id'
                AND p2.key LIKE 'appel-offre|%'
              WHERE
                p1.key LIKE 'dossier-raccordement|%'
                AND p1.value ->> 'miseEnService.dateMiseEnService' IS NOT NULL
                AND p2."value" ->> 'cycleAppelOffre' = 'PPE2'
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
