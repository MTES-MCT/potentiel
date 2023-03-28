import { executeSelect } from '@potentiel/pg-helpers';
import { Event } from './event';

export const loadFromStream = (streamId: string): Promise<ReadonlyArray<Event>> =>
  executeSelect<Event>(
    `SELECT "type", "payload", "version" FROM "EVENT_STREAM" where "streamId" = $1 order by "createdAt", "version"`,
    streamId,
  );
