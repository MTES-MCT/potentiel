import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { Event } from '../event.js';

const insertEvent = `
  insert into event_store.event_stream
  values (
    $1,
    $2,
    $3,
    coalesce(
      $6,
      (select count(stream_id) + 1 from event_store.event_stream where stream_id = $5)
    ),
    $4
  )
`;
export type PublishEvent = Pick<Event, 'payload' | 'type'> & {
  created_at?: string;
  version?: number;
};

export const publish = async (streamId: string, ...events: ReadonlyArray<PublishEvent>) => {
  const createdAt = new Date().toISOString();

  for (const { type, payload, created_at = createdAt, version } of events) {
    await executeQuery(insertEvent, streamId, created_at, type, payload, streamId, version);
  }
};
