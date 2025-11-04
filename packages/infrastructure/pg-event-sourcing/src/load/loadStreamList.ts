import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';

export type LoadStreamListOptions = {
  category: string;
  eventTypes?: Array<string>;
};

export const loadStreamList = async ({
  category,
  eventTypes,
}: LoadStreamListOptions): Promise<ReadonlyArray<{ stream_id: string }>> => {
  const hasEventTypes = eventTypes && eventTypes.length;

  const baseQuery = `select distinct stream_id from event_store.event_stream where stream_id like $1 || '|%'`;
  const whereEventTypeCondition = hasEventTypes ? 'and type = any($2)' : '';

  const query = `${baseQuery} ${whereEventTypeCondition} `;
  const params = hasEventTypes ? [category, eventTypes] : [category];

  return executeSelect<{ stream_id: string }>(format(query), ...params);
};
