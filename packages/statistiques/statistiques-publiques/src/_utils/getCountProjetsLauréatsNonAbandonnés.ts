export const getCountProjetsLauréatsNonAbandonnés = `
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
      )`;
