import { executeSelect } from '@potentiel/pg-helpers';
import { Event } from '../event';

const selectEventsByStreamId =
  'select type, payload, version from event_store.event_stream where stream_id = $1 order by created_at, version';

export const loadFromStream = (streamId: string): Promise<ReadonlyArray<Event>> =>
  executeSelect<Event>(selectEventsByStreamId, streamId);
