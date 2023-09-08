import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from '../event';

export const insertEventsInDatabase = async (...events: ReadonlyArray<Event>) => {
  for (const { created_at, payload, stream_id, type, version } of events) {
    await executeQuery(
      `
        insert 
        into event_store.event_stream 
        values (
            $1, 
            $2, 
            $3, 
            $4,
            $5
            )`,
      stream_id,
      created_at,
      type,
      version,
      payload,
    );
  }
};
