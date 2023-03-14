import { DomainEvent } from '@potentiel/core-domain';
import { executeSelect } from './helpers/executeSelect';

type Event = DomainEvent & {
  version: number;
};

export const loadFromStream = (streamId: string): Promise<ReadonlyArray<Event>> =>
  executeSelect<Event>(
    `SELECT "type", "payload", "version" FROM "EVENT_STREAM" where "streamId" = $1 order by "createdAt", "version"`,
    streamId,
  );
