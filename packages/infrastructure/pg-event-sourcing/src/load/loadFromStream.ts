import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DomainEvent } from '@potentiel-domain/core';

import { Event } from '../event.js';

export type LoadFromStreamOptions = {
  streamId: string;
  eventTypes?: Array<string>;
};

export const loadFromStream = async <TEvent extends DomainEvent>({
  streamId,
  eventTypes,
}: LoadFromStreamOptions): Promise<ReadonlyArray<TEvent & Event>> => {
  const hasEventTypes = eventTypes && eventTypes.length;

  const baseQuery = `select stream_id, created_at, type, payload, version from event_store.event_stream where stream_id = $1 and type <> 'RebuildTriggered'`;
  const orderByClause = 'order by created_at, version';
  const whereEventTypeCondition = hasEventTypes ? 'and type = any($2)' : '';

  const query = `${baseQuery} ${whereEventTypeCondition} ${orderByClause}`;
  const params = hasEventTypes ? [streamId, eventTypes] : [streamId];

  return executeSelect<TEvent & Event>(format(query), ...params);
};
