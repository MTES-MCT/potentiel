import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

(async () => {
  const candidatures = await executeSelect<{
    value: {
      stream_id: string;
      payload: Record<string, string>;
    };
  }>(`
    select json_build_object(
      'stream_id', es."stream_id",
      'payload', es."payload"
    ) as value
    from event_store.event_stream es
    where stream_id ilike 'candidature|%' and (
          payload->>'appelOffre' is null
       or payload->>'période' is null
       or payload->>'famille' is null
       or payload->>'numéroCRE' is null
    );
  `);

  console.info(`${candidatures.length} candidatures to fix...`);

  console.info(`Drop rule to prevent update on event_stream`);
  await executeQuery(`DROP RULE prevent_update_on_event_stream ON event_store.event_stream;`);

  for (const candidature of candidatures) {
    try {
      const { stream_id, payload } = candidature.value;

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

      const newPayload = {
        ...payload,
        appelOffre: identifiantProjet.appelOffre,
        période: identifiantProjet.période,
        famille: identifiantProjet.famille,
        numéroCRE: identifiantProjet.numéroCRE,
      };

      await executeQuery(
        `
        update event_store.event_stream es
        set payload = $1
        where stream_id = $2
        `,
        newPayload,
        stream_id,
      );
    } catch (error) {
      console.error(error);
    }
  }

  console.info(`Create rule to prevent update on event_stream`);
  await executeQuery(`
    CREATE RULE prevent_update_on_event_stream AS
    ON UPDATE TO event_store.event_stream DO INSTEAD  SELECT event_store.throw_when_trying_to_update_event() AS throw_when_trying_to_update_event;
  `);

  process.exit(0);
})();
