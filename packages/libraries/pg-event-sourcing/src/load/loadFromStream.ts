import { executeSelect } from '@potentiel/pg-helpers';
import { Event } from '../event';
import format from 'pg-format';

export type LoadFromStreamOptions = {
  streamId: string;
  eventTypes?: Array<string>;
};

export const loadFromStream = async ({
  streamId,
  eventTypes,
}: LoadFromStreamOptions): Promise<ReadonlyArray<Event>> => {
  const hasEventTypes = eventTypes && eventTypes.length;

  const baseQuery = `select stream_id, created_at, type, payload, version from event_store.event_stream where stream_id = $1 and type <> 'RebuildTriggered'`;
  const orderByClause = 'order by created_at, version';
  const whereEventTypeCondition = hasEventTypes ? 'and type = any($2)' : '';

  const query = `${baseQuery} ${whereEventTypeCondition} ${orderByClause}`;

  console.log(query);

  const params = hasEventTypes ? [streamId, eventTypes] : [streamId];

  console.log(JSON.stringify(params));

  return executeSelect<Event>(format(query), ...params);
};
