import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from '../event';

const insertEvent =
  'insert into event_store.event_stream values ($1, $2, $3, (select count(stream_id) + 1 from event_store.event_stream WHERE stream_id = $5), $4)';

export const publish = async (
  streamId: string,
  ...events: ReadonlyArray<Pick<Event, 'payload' | 'type'>>
) => {
  const createdAt = new Date().toISOString();
  for (const { type, payload } of events) {
    console.log('PUBLISH', type, payload);
    await executeQuery(insertEvent, streamId, createdAt, type, payload, streamId);
  }
};
